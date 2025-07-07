import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const GITA_DATA = [
  // Array of Bhagavad Gita verses
  {
    chapter: 2,
    verse: 47,
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    translation: "You have the right to perform your actions, but never to the fruits of action...",
    commentary: "This verse teaches the principle of performing duty without attachment to results."
  },
  {
    chapter: 4,
    verse: 7,
    sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥",
    translation: "Whenever there is a decline in righteousness, I manifest myself...",
    commentary: "The divine appears to restore balance when righteousness declines."
  },
  // Add more verses if needed
];

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [relevantVerse, setRelevantVerse] = useState(null);

  const findRelevantVerse = (question) => {
    const keywords = question.toLowerCase();
    
    if (keywords.includes('stress') || keywords.includes('worry') || keywords.includes('anxiety')) {
      return GITA_DATA[0]; // Karma yoga verse
    }
    if (keywords.includes('purpose') || keywords.includes('duty') || keywords.includes('dharma')) {
      return GITA_DATA[1]; // Divine purpose verse
    }
    return GITA_DATA[0]; // Default if no match
  };

  const askQuestion = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    const verse = findRelevantVerse(question);
    setRelevantVerse(verse);
    
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a wise spiritual teacher who provides guidance based on the Bhagavad Gita. 
            Use the following verse to answer the user's question:
            
            Chapter ${verse.chapter}, Verse ${verse.verse}:
            Sanskrit: ${verse.sanskrit}
            Translation: ${verse.translation}
            Commentary: ${verse.commentary}
            
            Provide a thoughtful, compassionate answer that relates this verse to their question.`
          },
          {
            role: 'user',
            content: question
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      setAnswer(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error:', error);
      setAnswer('I apologize, but I encountered an error. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>🕉️ Bhagavad Gita AI Assistant</h1>
          <p>Seek wisdom from Krishna's eternal teachings</p>
        </header>

        <div className="question-section">
          <div className="input-group">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about life, stress, purpose, relationships..."
              onKeyPress={(e) => e.key === 'Enter' && askQuestion()}
            />
            <button onClick={askQuestion} disabled={loading}>
              {loading ? 'Seeking...' : 'Ask'}
            </button>
          </div>
        </div>

        {answer && (
          <div className="answer-section">
            <div className="answer">
              <h3>Krishna's Guidance:</h3>
              <p>{answer}</p>
            </div>

            {relevantVerse && (
              <div className="verse">
                <h4>Referenced Verse - Chapter {relevantVerse.chapter}, Verse {relevantVerse.verse}</h4>
                <div className="sanskrit">{relevantVerse.sanskrit}</div>
                <div className="translation">"{relevantVerse.translation}"</div>
                <div className="commentary">{relevantVerse.commentary}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
