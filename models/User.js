const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['user', 'admin', 'moderator'] },
    
    
    displayName: String,
    avatar: String,
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },
    joinDate: { type: Date, default: Date.now },
    lastActive: Date,
    
    
    gamesPlayed: { type: Number, default: 0 },
    totalPlayTime: { type: Number, default: 0 }, 
    
    
    favoriteGames: [String],
    equippedItems: {
      
      character: { type: mongoose.Schema.Types.ObjectId, ref: 'GameItem' },
      skin: { type: mongoose.Schema.Types.ObjectId, ref: 'GameItem' },
      accessory: { type: mongoose.Schema.Types.ObjectId, ref: 'GameItem' },
      emote: { type: mongoose.Schema.Types.ObjectId, ref: 'GameItem' },
    },
    
    
    privacy: {
      showInventory: { type: Boolean, default: true },
      showWallet: { type: Boolean, default: false },
      showLevel: { type: Boolean, default: true },
    }
});

module.exports = mongoose.model('User', UserSchema);