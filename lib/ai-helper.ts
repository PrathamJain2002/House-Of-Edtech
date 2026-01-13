// AI helper functions for task suggestions using GenAI API

export interface AISuggestion {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

interface GenAIRequest {
  model?: string;
  messages?: Array<{ role: string; content: string }>;
  prompt?: string;
  max_tokens?: number;
  temperature?: number;
}

/**
 * Calls the GenAI API to generate task suggestions
 */
async function callGenAIAPI(prompt: string): Promise<string> {
  const apiKey = process.env.GENAI_API_KEY;
  const apiUrl = process.env.GENAI_API_URL;
  const model = process.env.GENAI_MODEL;

  if (!apiKey) {
    throw new Error('GENAI_API_KEY is not configured');
  }

  // Detect API type based on API key or URL
  const isGoogleAPI = apiKey.startsWith('AIza') || apiUrl?.includes('googleapis.com') || apiUrl?.includes('generativelanguage');
  const isOpenAI = apiKey.startsWith('sk-') || apiUrl?.includes('openai.com');
  
  let requestBody: any;
  let finalUrl: string;
  let headers: Record<string, string>;

  if (isGoogleAPI) {
    // Google Gemini API format
    const geminiModel = model || 'gemini-pro';
    const geminiUrl = apiUrl || `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`;
    
    finalUrl = `${geminiUrl}?key=${apiKey}`;
    
    requestBody = {
      contents: [
        {
          parts: [
            {
              text: `You are a helpful task management assistant. Generate task suggestions in JSON format.\n\n${prompt}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    };

    headers = {
      'Content-Type': 'application/json',
      ...(process.env.GENAI_API_HEADERS ? JSON.parse(process.env.GENAI_API_HEADERS) : {}),
    };
  } else if (isOpenAI || !apiUrl) {
    // OpenAI format (default)
    finalUrl = apiUrl || 'https://api.openai.com/v1/chat/completions';
    
    requestBody = {
      model: model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful task management assistant. Generate task suggestions in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    };

    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      ...(process.env.GENAI_API_HEADERS ? JSON.parse(process.env.GENAI_API_HEADERS) : {}),
    };
  } else {
    // Generic API format
    finalUrl = apiUrl;
    
    requestBody = {
      prompt,
      model: model || 'default',
      max_tokens: 1000,
      temperature: 0.7,
    };

    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      ...(process.env.GENAI_API_HEADERS ? JSON.parse(process.env.GENAI_API_HEADERS) : {}),
    };
  }

  const response = await fetch(finalUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  // Handle different response formats
  if (isGoogleAPI) {
    // Google Gemini response format
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 
           data.candidates?.[0]?.content?.text || 
           data.text || 
           '';
  } else if (isOpenAI) {
    // OpenAI response format
    return data.choices?.[0]?.message?.content || data.choices?.[0]?.text || '';
  } else {
    // Generic format
    return data.text || data.content || data.response || JSON.stringify(data);
  }
}

/**
 * Parses AI response to extract task suggestions
 */
function parseAISuggestions(aiResponse: string): AISuggestion[] {
  try {
    // Try to parse as JSON first
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => ({
          title: item.title || item.task || '',
          description: item.description || item.desc || '',
          priority: (item.priority || 'medium').toLowerCase(),
          tags: Array.isArray(item.tags) ? item.tags : (item.tags ? [item.tags] : []),
        }));
      }
    }

    // Fallback: try to extract structured data from text
    const suggestions: AISuggestion[] = [];
    const lines = aiResponse.split('\n').filter(line => line.trim());
    
    for (let i = 0; i < lines.length; i += 3) {
      const titleMatch = lines[i]?.match(/title[:\-]?\s*(.+)/i) || lines[i]?.match(/^\d+[\.\)]\s*(.+)/);
      if (titleMatch) {
        suggestions.push({
          title: titleMatch[1].trim(),
          description: lines[i + 1]?.replace(/description[:\-]?\s*/i, '').trim() || '',
          priority: (lines[i + 2]?.match(/priority[:\-]?\s*(low|medium|high)/i)?.[1] || 'medium').toLowerCase() as 'low' | 'medium' | 'high',
          tags: lines[i + 2]?.match(/tags[:\-]?\s*\[(.+)\]/)?.[1]?.split(',').map(t => t.trim()) || [],
        });
      }
    }

    return suggestions.length > 0 ? suggestions : [];
  } catch (error) {
    console.error('Error parsing AI suggestions:', error);
    return [];
  }
}

export async function generateTaskSuggestions(
  existingTasks: Array<{ title: string; description: string; tags: string[] }>,
  userContext?: string
): Promise<AISuggestion[]> {
  try {
    // Build context from existing tasks
    const taskContext = existingTasks
      .slice(0, 10)
      .map(t => `- ${t.title}${t.description ? `: ${t.description}` : ''}${t.tags.length > 0 ? ` [${t.tags.join(', ')}]` : ''}`)
      .join('\n');

    const commonTags = extractCommonTags(existingTasks);
    const taskThemes = analyzeTaskThemes(existingTasks);

    const prompt = `Based on the user's existing tasks, suggest 3-5 relevant new tasks that would help them be more productive and organized.

Existing tasks:
${taskContext || 'No existing tasks'}

Common themes: ${taskThemes.join(', ') || 'general'}
Common tags: ${commonTags.join(', ') || 'none'}

${userContext ? `User context: ${userContext}` : ''}

Please provide suggestions in the following JSON format:
[
  {
    "title": "Task title",
    "description": "Brief description",
    "priority": "low|medium|high",
    "tags": ["tag1", "tag2"]
  }
]

Make the suggestions:
- Relevant to their existing work patterns
- Actionable and specific
- Varied in priority levels
- Include appropriate tags`;

    const aiResponse = await callGenAIAPI(prompt);
    const suggestions = parseAISuggestions(aiResponse);

    // Fallback to basic suggestions if AI parsing fails
    if (suggestions.length === 0) {
      return getFallbackSuggestions(existingTasks, taskThemes);
    }

    return suggestions.slice(0, 5);
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    // Return fallback suggestions if API fails
    return getFallbackSuggestions(existingTasks, analyzeTaskThemes(existingTasks));
  }
}

export async function categorizeTask(
  title: string,
  description: string
): Promise<{ tags: string[]; priority: 'low' | 'medium' | 'high' }> {
  try {
    const prompt = `Categorize this task and determine its priority:

Title: ${title}
Description: ${description}

Return a JSON object with:
{
  "tags": ["tag1", "tag2"],
  "priority": "low|medium|high"
}`;

    const aiResponse = await callGenAIAPI(prompt);
    
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          tags: Array.isArray(parsed.tags) ? parsed.tags : [],
          priority: (parsed.priority || 'medium').toLowerCase() as 'low' | 'medium' | 'high',
        };
      }
    } catch (parseError) {
      console.error('Error parsing categorization:', parseError);
    }
  } catch (error) {
    console.error('Error categorizing task:', error);
  }

  // Fallback to simple categorization
  return categorizeTaskFallback(title, description);
}

// Fallback functions
function getFallbackSuggestions(
  existingTasks: Array<{ title: string; description: string; tags: string[] }>,
  taskThemes: string[]
): AISuggestion[] {
  const suggestions: AISuggestion[] = [];

  if (taskThemes.includes('work')) {
    suggestions.push({
      title: 'Review weekly goals',
      description: 'Take time to review and adjust your weekly objectives',
      priority: 'medium',
      tags: ['work', 'planning'],
    });
  }

  if (taskThemes.includes('personal')) {
    suggestions.push({
      title: 'Schedule personal time',
      description: 'Block time for self-care and relaxation',
      priority: 'high',
      tags: ['personal', 'wellness'],
    });
  }

  suggestions.push({
    title: 'Review and prioritize tasks',
    description: 'Take a moment to review your task list and prioritize',
    priority: 'medium',
    tags: ['planning', 'review'],
  });

  return suggestions.slice(0, 3);
}

function categorizeTaskFallback(
  title: string,
  description: string
): { tags: string[]; priority: 'low' | 'medium' | 'high' } {
  const text = `${title} ${description}`.toLowerCase();
  const tags: string[] = [];
  let priority: 'low' | 'medium' | 'high' = 'medium';

  if (text.match(/\b(urgent|asap|important|critical)\b/)) {
    priority = 'high';
    tags.push('urgent');
  }

  if (text.match(/\b(work|job|office|meeting|project)\b/)) {
    tags.push('work');
  }

  if (text.match(/\b(personal|family|home|health)\b/)) {
    tags.push('personal');
  }

  if (text.match(/\b(shopping|buy|purchase)\b/)) {
    tags.push('shopping');
  }

  if (text.match(/\b(learn|study|read|course)\b/)) {
    tags.push('learning');
  }

  if (tags.length === 0) {
    tags.push('general');
  }

  return { tags, priority };
}

function extractCommonTags(tasks: Array<{ tags: string[] }>): string[] {
  const tagCounts: Record<string, number> = {};

  tasks.forEach((task) => {
    task.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag]) => tag);
}

function analyzeTaskThemes(tasks: Array<{ title: string; description: string }>): string[] {
  const themes: string[] = [];
  const text = tasks.map((t) => `${t.title} ${t.description}`).join(' ').toLowerCase();

  if (text.match(/\b(work|job|office|meeting|project|deadline)\b/)) {
    themes.push('work');
  }

  if (text.match(/\b(personal|family|home|health|wellness)\b/)) {
    themes.push('personal');
  }

  return themes;
}
