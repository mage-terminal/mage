import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

class PricePredictor:
    def __init__(self, sequence_length=60):
        self.sequence_length = sequence_length
        self.model = None
        self.scaler = MinMaxScaler()
        
    def create_model(self, input_shape):
        """Create LSTM model for price prediction"""
        model = Sequential([
            LSTM(units=50, return_sequences=True, input_shape=input_shape),
            Dropout(0.2),
            LSTM(units=50, return_sequences=True),
            Dropout(0.2),
            LSTM(units=50),
            Dropout(0.2),
            Dense(units=1)
        ])
        
        model.compile(
            optimizer='adam',
            loss='mean_squared_error',
            metrics=['mae']
        )
        
        return model
    
    def prepare_data(self, data):
        """Prepare data for LSTM model"""
        # Scale the data
        scaled_data = self.scaler.fit_transform(data)
        
        X, y = [], []
        for i in range(self.sequence_length, len(scaled_data)):
            X.append(scaled_data[i-self.sequence_length:i])
            y.append(scaled_data[i, 0])
            
        return np.array(X), np.array(y)
    
    def train(self, price_data, validation_split=0.2):
        """Train the price prediction model"""
        # Prepare training data
        X, y = self.prepare_data(price_data)
        
        # Create and compile model
        self.model = self.create_model((X.shape[1], X.shape[2]))
        
        # Setup callbacks
        callbacks = [
            EarlyStopping(patience=5, restore_best_weights=True),
            ModelCheckpoint(
                'models/best_model.h5',
                save_best_only=True
            )
        ]
        
        # Train model
        history = self.model.fit(
            X, y,
            epochs=100,
            batch_size=32,
            validation_split=validation_split,
            callbacks=callbacks,
            verbose=1
        )
        
        return history
    
    def predict(self, data):
        """Make price predictions"""
        if self.model is None:
            raise Exception("Model not trained yet")
            
        # Prepare prediction data
        scaled_data = self.scaler.transform(data)
        X = np.array([scaled_data[-self.sequence_length:]])
        
        # Make prediction
        scaled_prediction = self.model.predict(X)
        prediction = self.scaler.inverse_transform(
            np.concatenate([scaled_prediction, np.zeros((1, data.shape[1]-1))], axis=1)
        )
        
        return prediction[0, 0] 