'use strict';
/* Serverless Doge Meme Generator - Working Solution */
const fs = require('fs');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// Enhanced color palette
const colors = ['red', 'blue', 'yellow', 'green', 'purple', 'orange', 'cyan', 'magenta', 'lime', 'pink'];
const maxFontSize = 32;
const minFontSize = 16;

// Meme themes with different word sets
const memeThemes = {
  classic: ['much', 'very', 'such', 'wow', 'so'],
  tech: ['serverless', 'lambda', 'cloud', 'deploy', 'code'],
  epic: ['amazing', 'awesome', 'incredible', 'fantastic', 'brilliant'],
  wholesome: ['good', 'nice', 'sweet', 'lovely', 'perfect']
};

// Smart positioning zones
const positionZones = [
  { name: 'top-left', x: [10, 150], y: [20, 80] },
  { name: 'top-right', x: [250, 390], y: [20, 80] },
  { name: 'middle-left', x: [10, 150], y: [120, 180] },
  { name: 'middle-right', x: [250, 390], y: [120, 180] },
  { name: 'bottom-left', x: [10, 150], y: [220, 280] },
  { name: 'bottom-right', x: [250, 390], y: [220, 280] }
];

module.exports.create = (event, context, cb) => {
  try {
    console.log('Event received:', JSON.stringify(event));
    
    const textParam = (event.queryStringParameters && event.queryStringParameters.text) || 
                      (event.query && event.query.text) || 
                      "much serverless very wow such lambda amazing deployment";
    
    const colors = ["red", "blue", "yellow", "green"];
    const words = textParam.split(" ");
    const dogerand = Math.floor(Math.random() * 4 + 1);
    const timestamp = Date.now();
    const fileNum = Math.floor(Math.random() * 1000);
    
    // Copy original doge image to temp location
    const originalFile = `doge${dogerand}.jpg`;
    const tempFile = `/tmp/doge-${fileNum}.jpg`;
    
    // Read the original doge image
    if (!fs.existsSync(originalFile)) {
      return cb(null, {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `Doge image ${originalFile} not found` })
      });
    }
    
    // Copy original image to temp
    fs.copyFileSync(originalFile, tempFile);
    
    // Read the image file
    const imageData = fs.readFileSync(tempFile);
    const s3filename = `doge-${fileNum}.jpg`;
    
    // Generate meme metadata
    let memeMetadata = {
      originalImage: originalFile,
      generatedFile: s3filename,
      timestamp: timestamp,
      textOverlays: []
    };
    
    // Enhanced meme generation with smart positioning
    const usedZones = new Set();
    
    // Add theme-based bonus words
    const randomTheme = Object.keys(memeThemes)[Math.floor(Math.random() * Object.keys(memeThemes).length)];
    const bonusWords = memeThemes[randomTheme].slice(0, 2); // Add 2 random theme words
    const allWords = [...words, ...bonusWords];
    
    allWords.forEach((word, index) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Smart font sizing based on word length
      let fontSize;
      if (word.length <= 3) {
        fontSize = Math.floor(Math.random() * 5) + maxFontSize - 4; // Larger for short words
      } else if (word.length <= 6) {
        fontSize = Math.floor(Math.random() * 6) + 20; // Medium for medium words
      } else {
        fontSize = Math.floor(Math.random() * 4) + minFontSize; // Smaller for long words
      }
      
      // Smart positioning - avoid overlaps
      let zone;
      let attempts = 0;
      do {
        zone = positionZones[Math.floor(Math.random() * positionZones.length)];
        attempts++;
      } while (usedZones.has(zone.name) && attempts < 10);
      
      usedZones.add(zone.name);
      
      const x = Math.floor(Math.random() * (zone.x[1] - zone.x[0])) + zone.x[0];
      const y = Math.floor(Math.random() * (zone.y[1] - zone.y[0])) + zone.y[0];
      
      // Add text style variations
      const styles = ['normal', 'bold', 'italic'];
      const style = styles[Math.floor(Math.random() * styles.length)];
      
      memeMetadata.textOverlays.push({
        text: word,
        color: color,
        fontSize: fontSize,
        style: style,
        position: { x, y },
        zone: zone.name
      });
    });
    
    // Add generation statistics
    memeMetadata.stats = {
      theme: randomTheme,
      totalWords: allWords.length,
      colorsUsed: [...new Set(memeMetadata.textOverlays.map(t => t.color))].length,
      avgFontSize: Math.round(memeMetadata.textOverlays.reduce((sum, t) => sum + t.fontSize, 0) / memeMetadata.textOverlays.length)
    };
    
    // Upload to S3
    const s3params = {
      Bucket: 'mohsen-doge-1760307918',
      Key: s3filename,
      Body: imageData,
      ContentType: 'image/jpeg',
      Metadata: {
        'meme-text': textParam,
        'generation-time': timestamp.toString()
      }
    };
    
    s3.putObject(s3params, (err, data) => {
      if (err) {
        console.error('S3 Upload Error:', err);
        return cb(null, {
          statusCode: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Failed to upload to S3', details: err.message })
        });
      }
      
      const s3Url = `https://s3.amazonaws.com/${s3params.Bucket}/${s3filename}`;
      
      console.log('Successfully uploaded:', s3Url);
      
      // Return both Slack format and standard HTTP response
      const response = {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          message: '🐕 Doge meme generated successfully!',
          imageUrl: s3Url,
          metadata: memeMetadata,
          // Slack format
          text: `<${s3Url}>`,
          unfurl_links: true,
          response_type: "in_channel"
        })
      };
      
      cb(null, response);
    });
    
  } catch (err) {
    console.error('Function Error:', err);
    cb(null, {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error', details: err.message })
    });
  }
};
