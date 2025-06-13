# CineStream

A modern, accessible web application for discovering movies and managing your watchlist. Built with vanilla HTML, CSS, and JavaScript.

## 🌟 Features

- **Movie Search**: Search for movies by title, type, and year
- **Genre Discovery**: Browse popular movies by genre
- **Watchlist Management**: Save and manage your favorite movies
- **Streaming Information**: View where movies are available to stream
- **Surprise Me**: Get random movie recommendations
- **Responsive Design**: Works on all devices
- **Accessibility**: WCAG AAA compliant color scheme and keyboard navigation

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- An OMDb API key (for movie data)
- A Watchmode API key (for streaming information)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cinestream.git
   cd cinestream
   ```

2. Configure API keys:
   - Open `js/modules/api.js`
   - Replace `YOUR_OMDB_API_KEY` with your OMDb API key
   - Replace `YOUR_WATCHMODE_API_KEY` with your Watchmode API key

3. Start a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

## 🎨 Color Scheme

The application uses a WCAG AAA compliant color palette:
- Background: #003b49 (Dark Teal)
- Surface: #1b365d (Dark Blue)
- Text: #FFFFFF (White)
- Secondary Text: #d6d2c4 (Light Beige)
- Accent: #ffc845 (Gold/Yellow)
- Text on Accent: #003b49 (Dark Teal)

## 🛠️ Technical Details

### Project Structure
```
cinestream/
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   └── modules/
│       ├── api.js
│       ├── events.js
│       ├── layout.js
│       ├── storage.js
│       └── ui.js
├── images/
│   └── no-poster.jpg
└── index.html
```

### Key Technologies
- Vanilla JavaScript (ES6+)
- CSS3 with CSS Variables
- HTML5
- Local Storage API
- OMDb API
- Watchmode API

### Accessibility Features
- High contrast color scheme
- Keyboard navigation support
- ARIA labels and roles
- Semantic HTML structure
- Responsive design

## 📝 API Documentation

### OMDb API
- Used for movie search and details
- Documentation: [OMDb API](http://www.omdbapi.com/)

### Watchmode API
- Used for streaming availability
- Documentation: [Watchmode API](https://api.watchmode.com/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OMDb API for movie data
- Watchmode API for streaming information
- Font Awesome for icons 