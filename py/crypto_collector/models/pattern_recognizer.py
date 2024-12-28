import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from scipy.signal import find_peaks
from typing import List, Dict

class PatternRecognizer:
    def __init__(self):
        self.patterns = {
            'double_top': self._check_double_top,
            'double_bottom': self._check_double_bottom,
            'head_shoulders': self._check_head_shoulders,
            'triangle': self._check_triangle
        }
        
    def _check_double_top(self, prices: np.array, threshold: float = 0.02) -> bool:
        """Check for double top pattern"""
        peaks, _ = find_peaks(prices, distance=20)
        if len(peaks) < 2:
            return False
            
        # Check if two peaks are within threshold
        peak1, peak2 = peaks[-2:]
        return abs(prices[peak1] - prices[peak2]) / prices[peak1] < threshold
        
    def _check_double_bottom(self, prices: np.array, threshold: float = 0.02) -> bool:
        """Check for double bottom pattern"""
        valleys, _ = find_peaks(-prices, distance=20)
        if len(valleys) < 2:
            return False
            
        # Check if two valleys are within threshold
        valley1, valley2 = valleys[-2:]
        return abs(prices[valley1] - prices[valley2]) / prices[valley1] < threshold
        
    def _check_head_shoulders(self, prices: np.array, threshold: float = 0.02) -> bool:
        """Check for head and shoulders pattern"""
        peaks, _ = find_peaks(prices, distance=10)
        if len(peaks) < 3:
            return False
            
        # Check for head and shoulders formation
        last_three_peaks = peaks[-3:]
        peak_prices = prices[last_three_peaks]
        
        return (peak_prices[1] > peak_prices[0] and 
                peak_prices[1] > peak_prices[2] and
                abs(peak_prices[0] - peak_prices[2]) / peak_prices[0] < threshold)
                
    def _check_triangle(self, prices: np.array, window: int = 20) -> bool:
        """Check for triangle pattern"""
        if len(prices) < window:
            return False
            
        # Get highs and lows
        highs = pd.Series(prices).rolling(window=5).max()
        lows = pd.Series(prices).rolling(window=5).min()
        
        # Calculate slopes
        high_slope = np.polyfit(range(window), highs[-window:], 1)[0]
        low_slope = np.polyfit(range(window), lows[-window:], 1)[0]
        
        # Check for converging lines
        return abs(high_slope) < 0.1 and abs(low_slope) < 0.1
        
    def identify_patterns(self, price_data: pd.DataFrame) -> List[Dict]:
        """Identify technical patterns in price data"""
        prices = price_data['price'].values
        patterns_found = []
        
        for pattern_name, pattern_func in self.patterns.items():
            if pattern_func(prices):
                patterns_found.append({
                    'pattern': pattern_name,
                    'timestamp': price_data.index[-1],
                    'price': prices[-1]
                })
                
        return patterns_found
    
    def cluster_price_movements(self, price_data: pd.DataFrame, n_clusters: int = 5) -> Dict:
        """Cluster price movements to identify common patterns"""
        # Calculate returns
        returns = price_data['price'].pct_change().dropna()
        
        # Create features (e.g., returns over different periods)
        features = pd.DataFrame({
            'daily_return': returns,
            'weekly_return': returns.rolling(7).sum(),
            'volatility': returns.rolling(7).std()
        }).dropna()
        
        # Perform clustering
        kmeans = KMeans(n_clusters=n_clusters)
        clusters = kmeans.fit_predict(features)
        
        # Analyze clusters
        cluster_analysis = {}
        for i in range(n_clusters):
            cluster_data = features[clusters == i]
            cluster_analysis[f'cluster_{i}'] = {
                'size': len(cluster_data),
                'avg_return': cluster_data['daily_return'].mean(),
                'avg_volatility': cluster_data['volatility'].mean()
            }
            
        return cluster_analysis 