import os
from dotenv import load_dotenv

load_dotenv()

# API Configuration
API_KEY = os.getenv("CRYPTO_API_KEY")
API_BASE_URL = "https://api.coingecko.com/api/v3"

# Data Collection Settings
COLLECTION_INTERVAL = 5  # minutes
TOP_COINS = 100  # Number of top coins to track
HISTORICAL_DATA_DAYS = 30  # Days of historical data to maintain

# Database Configuration
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", 27017))
DB_NAME = os.getenv("DB_NAME", "crypto_data")

# Alert Settings
PRICE_CHANGE_ALERT = 5.0  # Alert if price changes by 5%
VOLUME_CHANGE_ALERT = 20.0  # Alert if volume changes by 20%
ENABLE_ALERTS = True

# Export Settings
EXPORT_FORMATS = ["csv", "json", "excel"]
EXPORT_PATH = "exports"

# Supported Cryptocurrencies
SUPPORTED_COINS = [
    "bitcoin",
    "ethereum",
    "binancecoin",
    "solana",
    "cardano",
    "ripple",
    "polkadot",
    "dogecoin"
]

# Technical Analysis Parameters
MA_PERIODS = [7, 14, 30]  # Moving average periods
RSI_PERIOD = 14
MACD_PARAMS = {
    "fast": 12,
    "slow": 26,
    "signal": 9
}

# Coin Classification Settings
CLASSIFICATION_CATEGORIES = {
    'MEME': {
        'min_volatility': 0.1,
        'max_market_cap_rank': 300,
        'social_importance': 0.4
    },
    'DeFi': {
        'min_tvl': 1000000,
        'min_holder_count': 1000,
        'smart_contract_required': True
    },
    'L1': {
        'min_tps': 1000,
        'min_validator_count': 100,
        'smart_contract_required': True
    },
    'GameFi': {
        'min_nft_volume': 10000,
        'min_active_players': 1000,
        'gaming_features_required': True
    },
    'Privacy': {
        'privacy_features_required': True,
        'anonymity_score_min': 0.7
    },
    'Infrastructure': {
        'min_integration_count': 10,
        'cross_chain_support': True
    }
}

# Classification Thresholds
CLASSIFICATION_THRESHOLDS = {
    'primary_category': 0.7,    # Minimum score for primary category
    'secondary_category': 0.4,  # Minimum score for secondary category
    'confidence_required': 0.3  # Minimum confidence score required
}

# OpenAI Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GPT_MODEL = "gpt-4"  # or "gpt-3.5-turbo"

# AI Analysis Settings
ANALYSIS_PROMPT_TEMPLATE = """
Analyze the following cryptocurrency data and provide insights:
Price: {price}
Market Cap: {market_cap}
24h Volume: {volume_24h}
Technical Indicators:
- RSI: {rsi}
- MACD: {macd}

Please provide:
1. Market sentiment analysis
2. Short-term price prediction (24h)
3. Key factors affecting the price
4. Trading recommendations
5. Risk assessment
""" 