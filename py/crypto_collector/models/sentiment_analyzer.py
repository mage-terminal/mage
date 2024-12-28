from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import numpy as np
from typing import List, Dict
import pandas as pd

class SentimentAnalyzer:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained('finiteautomata/bertweet-base-sentiment-analysis')
        self.model = AutoModelForSequenceClassification.from_pretrained('finiteautomata/bertweet-base-sentiment-analysis')
        
    def analyze_texts(self, texts: List[str]) -> List[Dict]:
        """Analyze sentiment of multiple texts"""
        results = []
        
        for text in texts:
            # Tokenize text
            inputs = self.tokenizer(
                text,
                return_tensors="pt",
                padding=True,
                truncation=True,
                max_length=512
            )
            
            # Get prediction
            with torch.no_grad():
                outputs = self.model(**inputs)
                predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
                
            # Get sentiment scores
            sentiment_scores = predictions[0].numpy()
            sentiment_dict = {
                'text': text,
                'negative': float(sentiment_scores[0]),
                'neutral': float(sentiment_scores[1]),
                'positive': float(sentiment_scores[2]),
                'sentiment': ['negative', 'neutral', 'positive'][np.argmax(sentiment_scores)]
            }
            
            results.append(sentiment_dict)
            
        return results
    
    def analyze_market_data(self, market_data: pd.DataFrame) -> Dict:
        """Analyze market sentiment based on various data points"""
        # Combine relevant market data into text descriptions
        texts = []
        
        for _, row in market_data.iterrows():
            text = f"Price: {row['price']}, Volume: {row['volume_24h']}, "
            text += f"Market Cap: {row['market_cap']}, "
            text += f"Price Change: {row['price_change_24h']}%"
            texts.append(text)
            
        # Analyze sentiment
        sentiments = self.analyze_texts(texts)
        
        # Aggregate results
        overall_sentiment = {
            'negative': np.mean([s['negative'] for s in sentiments]),
            'neutral': np.mean([s['neutral'] for s in sentiments]),
            'positive': np.mean([s['positive'] for s in sentiments]),
            'samples': len(sentiments)
        }
        
        return overall_sentiment 