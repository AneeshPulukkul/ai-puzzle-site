import type { AITool, AIUseCase } from '../types';

export const AI_TOOLS: AITool[] = [
  {
    id: 'openai-gpt4',
    name: 'GPT-4',
    description: 'Advanced language model that can understand and generate human-like text',
    category: 'model',
    capabilities: ['text generation', 'summarization', 'question answering', 'translation'],
    complexity: 'intermediate',
  },
  {
    id: 'tensorflow',
    name: 'TensorFlow',
    description: 'Open-source machine learning framework developed by Google',
    category: 'framework',
    capabilities: ['neural networks', 'deep learning', 'model training', 'model deployment'],
    complexity: 'advanced',
  },
  {
    id: 'huggingface',
    name: 'Hugging Face Transformers',
    description: 'Library of pre-trained models for natural language processing tasks',
    category: 'tool',
    capabilities: ['text classification', 'named entity recognition', 'question answering', 'summarization'],
    complexity: 'intermediate',
  },
  {
    id: 'pytorch',
    name: 'PyTorch',
    description: 'Open-source machine learning library developed by Facebook',
    category: 'framework',
    capabilities: ['neural networks', 'computer vision', 'natural language processing', 'reinforcement learning'],
    complexity: 'advanced',
  },
  {
    id: 'dalle',
    name: 'DALL-E',
    description: 'AI system that can create realistic images and art from text descriptions',
    category: 'model',
    capabilities: ['image generation', 'creative design', 'visual concept rendering'],
    complexity: 'beginner',
  },
  {
    id: 'scikit-learn',
    name: 'Scikit-learn',
    description: 'Simple and efficient tools for data mining and data analysis',
    category: 'tool',
    capabilities: ['classification', 'regression', 'clustering', 'dimensionality reduction'],
    complexity: 'intermediate',
  },
  {
    id: 'langchain',
    name: 'LangChain',
    description: 'Framework for developing applications powered by language models',
    category: 'framework',
    capabilities: ['chatbots', 'agents', 'prompt management', 'memory management'],
    complexity: 'intermediate',
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    description: 'Latent text-to-image diffusion model for generating detailed images',
    category: 'model',
    capabilities: ['image generation', 'image editing', 'inpainting', 'outpainting'],
    complexity: 'intermediate',
  },
  {
    id: 'spacy',
    name: 'spaCy',
    description: 'Industrial-strength natural language processing library',
    category: 'tool',
    capabilities: ['tokenization', 'named entity recognition', 'part-of-speech tagging', 'dependency parsing'],
    complexity: 'beginner',
  },
  {
    id: 'llama',
    name: 'Llama',
    description: 'Large language model developed by Meta',
    category: 'model',
    capabilities: ['text generation', 'reasoning', 'creative writing', 'code generation'],
    complexity: 'intermediate',
  },
  {
    id: 'nltk',
    name: 'NLTK',
    description: 'Platform for building Python programs to work with human language data',
    category: 'tool',
    capabilities: ['tokenization', 'stemming', 'tagging', 'parsing'],
    complexity: 'beginner',
  },
  {
    id: 'keras',
    name: 'Keras',
    description: 'High-level neural networks API, written in Python',
    category: 'framework',
    capabilities: ['neural networks', 'deep learning', 'model design', 'model training'],
    complexity: 'intermediate',
  },
];

export const AI_USE_CASES: AIUseCase[] = [
  {
    id: 'text-summarization',
    title: 'Text Summarization Service',
    description: 'Build a service that can summarize long articles into concise summaries',
    difficulty: 'easy',
    requiredTools: ['openai-gpt4'],
    optionalTools: ['huggingface', 'langchain', 'nltk'],
    hints: [
      'Consider what language model would be best for understanding context',
      'Think about tools that can help with text processing',
      'You might need a framework to manage the interaction with the model'
    ],
    solution: ['openai-gpt4', 'langchain', 'nltk']
  },
  {
    id: 'image-generator',
    title: 'AI Art Generator',
    description: 'Create a system that generates art based on text descriptions',
    difficulty: 'medium',
    requiredTools: ['dalle', 'stable-diffusion'],
    optionalTools: ['pytorch', 'tensorflow'],
    hints: [
      'You need models specialized in image generation',
      'Consider which framework would help optimize the generation process',
      'Think about how to process and prepare the text descriptions'
    ],
    solution: ['dalle', 'stable-diffusion', 'pytorch']
  },
  {
    id: 'sentiment-analysis',
    title: 'Social Media Sentiment Analyzer',
    description: 'Develop a tool that analyzes the sentiment of social media posts',
    difficulty: 'medium',
    requiredTools: ['huggingface', 'scikit-learn'],
    optionalTools: ['tensorflow', 'spacy', 'nltk'],
    hints: [
      'You need tools for text classification',
      'Consider what would help with linguistic analysis',
      'Think about statistical analysis tools'
    ],
    solution: ['huggingface', 'scikit-learn', 'spacy']
  },
  {
    id: 'chatbot',
    title: 'Customer Service Chatbot',
    description: 'Build an intelligent chatbot that can handle customer service inquiries',
    difficulty: 'hard',
    requiredTools: ['openai-gpt4', 'langchain'],
    optionalTools: ['huggingface', 'llama', 'tensorflow'],
    hints: [
      'You need a powerful language model for understanding customer queries',
      'Consider tools that help manage conversation flow and memory',
      'Think about frameworks that can integrate with existing systems'
    ],
    solution: ['openai-gpt4', 'langchain', 'huggingface']
  },
  {
    id: 'code-assistant',
    title: 'AI Code Assistant',
    description: 'Create an AI-powered coding assistant that can suggest code completions and improvements',
    difficulty: 'hard',
    requiredTools: ['openai-gpt4', 'llama'],
    optionalTools: ['huggingface', 'langchain'],
    hints: [
      'You need models that excel at code generation',
      'Consider tools that can understand programming context',
      'Think about frameworks that can integrate with development environments'
    ],
    solution: ['openai-gpt4', 'llama', 'langchain']
  },
  {
    id: 'object-detection',
    title: 'Real-time Object Detection System',
    description: 'Develop a system that can identify and track objects in video streams',
    difficulty: 'hard',
    requiredTools: ['tensorflow', 'pytorch'],
    optionalTools: ['keras', 'scikit-learn'],
    hints: [
      'You need frameworks specialized in computer vision',
      'Consider tools that can process real-time data efficiently',
      'Think about high-level APIs that simplify model development'
    ],
    solution: ['tensorflow', 'pytorch', 'keras']
  }
];
