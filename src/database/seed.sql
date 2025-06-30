-- Insert data for AI Tools
INSERT INTO ai_tools (id, name, description, category, complexity) VALUES
('openai-gpt4', 'GPT-4', 'Advanced language model that can understand and generate human-like text', 'model', 'intermediate'),
('tensorflow', 'TensorFlow', 'Open-source machine learning framework developed by Google', 'framework', 'advanced'),
('huggingface', 'Hugging Face Transformers', 'Library of pre-trained models for natural language processing tasks', 'tool', 'intermediate'),
('pytorch', 'PyTorch', 'Open-source machine learning library developed by Facebook', 'framework', 'advanced'),
('dalle', 'DALL-E', 'AI system that can create realistic images and art from text descriptions', 'model', 'beginner'),
('scikit-learn', 'Scikit-learn', 'Simple and efficient tools for data mining and data analysis', 'tool', 'intermediate'),
('langchain', 'LangChain', 'Framework for developing applications powered by language models', 'framework', 'intermediate'),
('stable-diffusion', 'Stable Diffusion', 'Latent text-to-image diffusion model for generating detailed images', 'model', 'intermediate'),
('spacy', 'spaCy', 'Industrial-strength natural language processing library', 'tool', 'beginner'),
('llama', 'Llama', 'Large language model developed by Meta', 'model', 'intermediate'),
('nltk', 'NLTK', 'Platform for building Python programs to work with human language data', 'tool', 'beginner'),
('keras', 'Keras', 'High-level neural networks API, written in Python', 'framework', 'intermediate')
ON CONFLICT (id) DO NOTHING;

-- Insert Tool Capabilities
INSERT INTO ai_tool_capabilities (tool_id, capability) VALUES
('openai-gpt4', 'text generation'),
('openai-gpt4', 'summarization'),
('openai-gpt4', 'question answering'),
('openai-gpt4', 'translation'),
('tensorflow', 'neural networks'),
('tensorflow', 'deep learning'),
('tensorflow', 'model training'),
('tensorflow', 'model deployment'),
('huggingface', 'text classification'),
('huggingface', 'named entity recognition'),
('huggingface', 'question answering'),
('huggingface', 'summarization'),
('pytorch', 'neural networks'),
('pytorch', 'computer vision'),
('pytorch', 'natural language processing'),
('pytorch', 'reinforcement learning'),
('dalle', 'image generation'),
('dalle', 'creative design'),
('dalle', 'visual concept rendering'),
('scikit-learn', 'classification'),
('scikit-learn', 'regression'),
('scikit-learn', 'clustering'),
('scikit-learn', 'dimensionality reduction'),
('langchain', 'chatbots'),
('langchain', 'agents'),
('langchain', 'prompt management'),
('langchain', 'memory management'),
('stable-diffusion', 'image generation'),
('stable-diffusion', 'image editing'),
('stable-diffusion', 'inpainting'),
('stable-diffusion', 'outpainting'),
('spacy', 'tokenization'),
('spacy', 'named entity recognition'),
('spacy', 'part-of-speech tagging'),
('spacy', 'dependency parsing'),
('llama', 'text generation'),
('llama', 'reasoning'),
('llama', 'creative writing'),
('llama', 'code generation'),
('nltk', 'tokenization'),
('nltk', 'stemming'),
('nltk', 'tagging'),
('nltk', 'parsing'),
('keras', 'neural networks'),
('keras', 'deep learning'),
('keras', 'model design'),
('keras', 'model training')
ON CONFLICT (tool_id, capability) DO NOTHING;

-- Insert AI Use Cases
INSERT INTO ai_use_cases (id, title, description, difficulty) VALUES
('text-summarization', 'Text Summarization Service', 'Build a service that can summarize long articles into concise summaries', 'easy'),
('image-generator', 'AI Art Generator', 'Create a system that generates art based on text descriptions', 'medium'),
('sentiment-analysis', 'Social Media Sentiment Analyzer', 'Develop a tool that analyzes the sentiment of social media posts', 'medium'),
('chatbot', 'Customer Service Chatbot', 'Build an intelligent chatbot that can handle customer service inquiries', 'hard'),
('code-assistant', 'AI Code Assistant', 'Create an AI-powered coding assistant that can suggest code completions and improvements', 'hard'),
('object-detection', 'Real-time Object Detection System', 'Develop a system that can identify and track objects in video streams', 'hard')
ON CONFLICT (id) DO NOTHING;

-- Insert Use Case Hints
INSERT INTO ai_use_case_hints (use_case_id, hint_order, hint_text) VALUES
('text-summarization', 1, 'Consider what language model would be best for understanding context'),
('text-summarization', 2, 'Think about tools that can help with text processing'),
('text-summarization', 3, 'You might need a framework to manage the interaction with the model'),
('image-generator', 1, 'You need models specialized in image generation'),
('image-generator', 2, 'Consider which framework would help optimize the generation process'),
('image-generator', 3, 'Think about how to process and prepare the text descriptions'),
('sentiment-analysis', 1, 'You need tools for text classification'),
('sentiment-analysis', 2, 'Consider what would help with linguistic analysis'),
('sentiment-analysis', 3, 'Think about statistical analysis tools'),
('chatbot', 1, 'You need a powerful language model for understanding customer queries'),
('chatbot', 2, 'Consider tools that help manage conversation flow and memory'),
('chatbot', 3, 'Think about frameworks that can integrate with existing systems'),
('code-assistant', 1, 'You need models that excel at code generation'),
('code-assistant', 2, 'Consider tools that can understand programming context'),
('code-assistant', 3, 'Think about frameworks that can integrate with development environments'),
('object-detection', 1, 'You need frameworks specialized in computer vision'),
('object-detection', 2, 'Consider tools that can process real-time data efficiently'),
('object-detection', 3, 'Think about high-level APIs that simplify model development')
ON CONFLICT (use_case_id, hint_order) DO NOTHING;

-- Insert Required Tools for Use Cases
INSERT INTO ai_use_case_required_tools (use_case_id, tool_id) VALUES
('text-summarization', 'openai-gpt4'),
('image-generator', 'dalle'),
('image-generator', 'stable-diffusion'),
('sentiment-analysis', 'huggingface'),
('sentiment-analysis', 'scikit-learn'),
('chatbot', 'openai-gpt4'),
('chatbot', 'langchain'),
('code-assistant', 'openai-gpt4'),
('code-assistant', 'llama'),
('object-detection', 'tensorflow'),
('object-detection', 'pytorch')
ON CONFLICT (use_case_id, tool_id) DO NOTHING;

-- Insert Optional Tools for Use Cases
INSERT INTO ai_use_case_optional_tools (use_case_id, tool_id) VALUES
('text-summarization', 'huggingface'),
('text-summarization', 'langchain'),
('text-summarization', 'nltk'),
('image-generator', 'pytorch'),
('image-generator', 'tensorflow'),
('sentiment-analysis', 'tensorflow'),
('sentiment-analysis', 'spacy'),
('sentiment-analysis', 'nltk'),
('chatbot', 'huggingface'),
('chatbot', 'llama'),
('chatbot', 'tensorflow'),
('code-assistant', 'huggingface'),
('code-assistant', 'langchain'),
('object-detection', 'keras'),
('object-detection', 'scikit-learn')
ON CONFLICT (use_case_id, tool_id) DO NOTHING;

-- Insert Solution Tools for Use Cases
INSERT INTO ai_use_case_solution_tools (use_case_id, tool_id, solution_order) VALUES
('text-summarization', 'openai-gpt4', 1),
('text-summarization', 'langchain', 2),
('text-summarization', 'nltk', 3),
('image-generator', 'dalle', 1),
('image-generator', 'stable-diffusion', 2),
('image-generator', 'pytorch', 3),
('sentiment-analysis', 'huggingface', 1),
('sentiment-analysis', 'scikit-learn', 2),
('sentiment-analysis', 'spacy', 3),
('chatbot', 'openai-gpt4', 1),
('chatbot', 'langchain', 2),
('chatbot', 'huggingface', 3),
('code-assistant', 'openai-gpt4', 1),
('code-assistant', 'llama', 2),
('code-assistant', 'langchain', 3),
('object-detection', 'tensorflow', 1),
('object-detection', 'pytorch', 2),
('object-detection', 'keras', 3)
ON CONFLICT (use_case_id, tool_id) DO NOTHING;
