from typing import Dict, List
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from transformers import pipeline

class CoinClassifier:
    def __init__(self):
        self.categories = {
            'MEME': {
                'keywords': ['doge', 'shiba', 'pepe', 'meme', 'inu', 'moon', 'safe'],
                'features': ['high_volatility', 'social_mentions', 'low_market_cap']
            },
            'DeFi': {
                'keywords': ['swap', 'yield', 'lending', 'defi', 'dao', 'governance'],
                'features': ['smart_contracts', 'tvl', 'yield_rate']
            },
            'L1': {
                'keywords': ['chain', 'blockchain', 'platform', 'smart contract'],
                'features': ['tps', 'active_validators', 'network_usage']
            },
            'GameFi': {
                'keywords': ['game', 'play', 'nft', 'metaverse', 'virtual'],
                'features': ['nft_volume', 'active_players', 'game_revenue']
            },
            'Privacy': {
                'keywords': ['privacy', 'anonymous', 'confidential', 'zero-knowledge'],
                'features': ['transaction_privacy', 'mixer_usage']
            },
            'Infrastructure': {
                'keywords': ['oracle', 'bridge', 'interoperability', 'scaling'],
                'features': ['integration_count', 'cross_chain_volume']
            }
        }
        
        self.classifier = RandomForestClassifier()
        self.text_classifier = pipeline("zero-shot-classification")
        
    def extract_features(self, coin_data: Dict) -> Dict:
        """Extract relevant features for classification"""
        features = {
            'volatility': self._calculate_volatility(coin_data['price_history']),
            'market_cap_rank': coin_data.get('market_cap_rank', 999),
            'age_days': self._calculate_age(coin_data.get('launch_date')),
            'holder_count': coin_data.get('holder_count', 0),
            'social_score': self._calculate_social_score(coin_data),
            'developer_score': self._calculate_developer_score(coin_data),
            'tvl_ratio': self._calculate_tvl_ratio(coin_data),
            'nft_activity': self._calculate_nft_activity(coin_data)
        }
        return features
    
    def _calculate_volatility(self, price_history: List[float]) -> float:
        """Calculate price volatility"""
        if not price_history:
            return 0.0
        returns = pd.Series(price_history).pct_change().dropna()
        return returns.std()
    
    def _calculate_social_score(self, coin_data: Dict) -> float:
        """Calculate social media presence score"""
        social_metrics = {
            'twitter_followers': coin_data.get('twitter_followers', 0),
            'reddit_subscribers': coin_data.get('reddit_subscribers', 0),
            'telegram_members': coin_data.get('telegram_members', 0),
            'github_stars': coin_data.get('github_stars', 0)
        }
        return sum(social_metrics.values()) / 1000  # Normalize
    
    def _calculate_developer_score(self, coin_data: Dict) -> float:
        """Calculate developer activity score"""
        dev_metrics = {
            'github_commits': coin_data.get('github_commits', 0),
            'github_contributors': coin_data.get('github_contributors', 0),
            'github_issues': coin_data.get('github_issues', 0)
        }
        return sum(dev_metrics.values()) / 100  # Normalize
    
    def _calculate_tvl_ratio(self, coin_data: Dict) -> float:
        """Calculate TVL to Market Cap ratio"""
        tvl = coin_data.get('total_value_locked', 0)
        market_cap = coin_data.get('market_cap', 1)
        return tvl / market_cap if market_cap > 0 else 0
    
    def _calculate_nft_activity(self, coin_data: Dict) -> float:
        """Calculate NFT-related activity"""
        nft_metrics = {
            'nft_trading_volume': coin_data.get('nft_volume', 0),
            'nft_holders': coin_data.get('nft_holders', 0),
            'gaming_users': coin_data.get('gaming_users', 0)
        }
        return sum(nft_metrics.values()) / 1000  # Normalize
    
    def _calculate_age(self, launch_date) -> int:
        """Calculate coin age in days"""
        if not launch_date:
            return 0
        return (pd.Timestamp.now() - pd.Timestamp(launch_date)).days
    
    def classify_coin(self, coin_data: Dict) -> Dict[str, float]:
        """Classify coin into different categories with confidence scores"""
        # Extract features
        features = self.extract_features(coin_data)
        
        # Text-based classification using coin description
        text_results = self.text_classifier(
            coin_data.get('description', ''),
            candidate_labels=list(self.categories.keys())
        )
        
        # Combine feature-based and text-based classification
        combined_scores = {}
        for category, score in zip(text_results['labels'], text_results['scores']):
            feature_score = self._calculate_feature_score(category, features)
            combined_scores[category] = (score + feature_score) / 2
            
        return combined_scores
    
    def _calculate_feature_score(self, category: str, features: Dict) -> float:
        """Calculate feature-based score for a category"""
        if category == 'MEME':
            return self._calculate_meme_score(features)
        elif category == 'DeFi':
            return self._calculate_defi_score(features)
        elif category == 'GameFi':
            return self._calculate_gamefi_score(features)
        # Add more category-specific scoring methods
        return 0.5  # Default score
    
    def _calculate_meme_score(self, features: Dict) -> float:
        """Calculate MEME coin score based on features"""
        score = 0.0
        score += min(features['volatility'] * 2, 1.0)  # High volatility
        score += (1000 - min(features['market_cap_rank'], 1000)) / 1000  # Lower rank
        score += min(features['social_score'] / 100, 1.0)  # Social activity
        return score / 3
    
    def _calculate_defi_score(self, features: Dict) -> float:
        """Calculate DeFi score based on features"""
        score = 0.0
        score += min(features['tvl_ratio'] * 2, 1.0)  # TVL importance
        score += min(features['developer_score'] / 50, 1.0)  # Developer activity
        score += min(features['holder_count'] / 10000, 1.0)  # User adoption
        return score / 3
    
    def _calculate_gamefi_score(self, features: Dict) -> float:
        """Calculate GameFi score based on features"""
        score = 0.0
        score += min(features['nft_activity'] / 100, 1.0)  # NFT activity
        score += min(features['social_score'] / 200, 1.0)  # Community engagement
        score += min(features['developer_score'] / 30, 1.0)  # Development activity
        return score / 3 