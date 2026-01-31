// const popupTrigger = document.getElementById('popupTrigger');
const moodButtons = document.querySelectorAll('.mood-button');
const cardOverlay = document.querySelector('.card-overlay');

const moodColors = {
    '😀 Happy': '#FFD700', // Gold
    '😄 Joyful': '#FFA500', // Orange
    '🤩 Excited': '#FF4500', // OrangeRed
    '😌 Content': '#9ACD32', // YellowGreen
    '🥰 Loved': '#FF69B4', // HotPink
    '😎 Confident': '#4682B4', // SteelBlue
    '🙌 Motivated': '#ADFF2F', // GreenYellow
    '😇 Grateful': '#DAA520', // Goldenrod

    '😌 Relaxed': '#ADD8E6', // LightBlue
    '🧘 Peaceful': '#87CEEB', // SkyBlue
    '🌊 Calm': '#6495ED', // CornflowerBlue
    '😴 Sleepy': '#7B68EE', // MediumSlateBlue
    '☁️ Dreamy': '#B0C4DE', // LightSteelBlue
    '🍃 Mindful': '#98FB98', // PaleGreen
    '🌙 Serene': '#B0E0E6', // PowderBlue

    '😔 Sad': '#6A5ACD', // SlateBlue
    '😞 Disappointed': '#483D8B', // DarkSlateBlue
    '😢 Emotional': '#4169E1', // RoyalBlue
    '💔 Heartbroken': '#8B0000', // DarkRed
    '😕 Confused': '#A9A9A9', // DarkGray
    '🥀 Lonely': '#708090', // SlateGray
    '🌧️ Gloomy': '#2F4F4F', // DarkSlateGray

    '😤 Determined': '#DC143C', // Crimson
    '🔥 Energetic': '#FF8C00', // DarkOrange
    '🤯 Overwhelmed': '#FF6347', // Tomato
    '⚡ Hyper': '#FFD700', // Gold (bright)
    '🏃 Restless': '#FF7F50', // Coral
    '🎯 Focused': '#00CED1', // DarkTurquoise

    '😠 Angry': '#B22222', // FireBrick
    '😡 Furious': '#8B0000', // DarkRed
    '😤 Frustrated': '#A52A2A', // Brown
    '😒 Annoyed': '#808000', // Olive
    '🔥 Irritated': '#CD5C5C', // IndianRed

    '😟 Anxious': '#808080', // Gray
    '😰 Stressed': '#696969', // DimGray
    '😬 Nervous': '#778899', // LightSlateGray
    '🌪️ Chaotic': '#5F9EA0', // CadetBlue

    '🤔 Thoughtful': '#6A5ACD', // SlateBlue
    '🧠 Reflective': '#483D8B', // DarkSlateBlue
    '✍️ Creative': '#BA55D3', // MediumOrchid
    '🎨 Inspired': '#FF69B4', // HotPink
    '🌌 Imaginative': '#9370DB' // MediumPurple
};

// Array of quotes
const quotes = [
    "'Turn your mood into color and sound.'",
    "'Feel it. See it. Hear it.'",
    "'Your emotions, reimagined through music and color.'",
    "'Where moods become music and art.'",
    "'Express how you feel—visually and musically.'"
];

// Get the quote display element
const quoteDisplay = document.getElementById('quoteDisplay');

// Function to display a random quote
function displayRandomQuote() {
    if (quoteDisplay && quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteDisplay.textContent = quotes[randomIndex];
    }
}

// Display a random quote when the page loads
document.addEventListener('DOMContentLoaded', displayRandomQuote);

// Function to lighten a hex color
function lightenColor(hex, percent) {
    var f = parseInt(hex.slice(1), 16),
        t = percent < 0 ? 0 : 255,
        p = percent < 0 ? percent * -1 : percent,
        c = "#",
        i = 0;
    for (; i < 3; i++) {
        var b = f % 256;
        f = f >> 8;
        c += ("00" + Math.round((t - b) * p + b).toString(16)).slice(-2);
    }
    return c;
}

// Initialize button colors on page load
moodButtons.forEach(button => {
    const buttonText = button.textContent.trim();
    const initialColor = moodColors[buttonText] || '#007bff'; // Default blue if not found
    button.style.backgroundColor = initialColor;
    button.style.color = 'white';
});



let selectedMoodText = ''; // Variable to store the currently selected mood

moodButtons.forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent.trim();
        selectedMoodText = button.textContent.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
        const selectedColor = moodColors[buttonText] || '#007bff'; // Default blue if not found
        const lighterColor = lightenColor(selectedColor, 0.3); // Lighten by 30%

        moodButtons.forEach(btn => {
            if (btn !== button) {
                btn.style.backgroundColor = '#6c757d'; // Deselected color
                btn.style.color = '#e9ecef';
            } else {
                btn.style.backgroundColor = selectedColor; // Apply specific mood color
                btn.style.color = 'white';
            }
        });

        // Update body background with a gradient
        if (document.body) {
            document.body.style.background = `linear-gradient(to bottom right, ${lighterColor}, ${selectedColor})`;
        }
    });
});

// Get the generate playlist button
const generateButton = document.querySelector('.generate-button');
// Get the playlist cards container
const playlistCardsContainer = document.getElementById('playlist-cards-container');
// Get the "No playlists message" element
const noPlaylistsMessage = document.getElementById('no-playlists-message');

// Function to create a playlist card
function createPlaylistCard(playlist) {
    const card = document.createElement('div');
    card.classList.add('playlist-card');

    const title = document.createElement('h4');
    title.textContent = playlist.title;
    card.appendChild(title);

    const description = document.createElement('p');
    description.textContent = playlist.description;
    card.appendChild(description);

    const link = document.createElement('a');
    link.href = playlist.url;
    link.textContent = 'Listen Now';
    link.target = '_blank'; // Open in new tab
    card.appendChild(link);

    return card;
}

// Event listener for the generate playlist button
generateButton.addEventListener('click', async () => {
    // Hide the playlist container initially
    playlistCardsContainer.style.display = 'none';

    // Remove the "No playlists generated yet" message if it exists
    if (noPlaylistsMessage) {
        noPlaylistsMessage.remove();
    }

    // Clear existing playlist cards
    playlistCardsContainer.innerHTML = '';

    if (!selectedMoodText) {
        alert('Please select a mood first!');
        return;
    }

    try {
        const response = await fetch(`/api/lastfm/track-search?mood=${encodeURIComponent(selectedMoodText)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

        const tracks = xmlDoc.querySelectorAll('track');
        if (tracks.length === 0) {
            const noResultsMessage = document.createElement('p');
            noResultsMessage.id = 'no-playlists-message';
            noResultsMessage.textContent = `No tracks found for mood: ${selectedMoodText}.`;
            playlistCardsContainer.appendChild(noResultsMessage);
            playlistCardsContainer.style.display = 'block';
            return;
        }

        tracks.forEach(track => {
            const streamable = track.querySelector('streamable')?.textContent;
            // Skip this track if it's not streamable (streamable !== '1')
            if (streamable !== '1') {
                return;
            }

            const title = track.querySelector('name')?.textContent || 'Unknown Title';
            const artist = track.querySelector('artist')?.textContent || 'Unknown Artist';
            const trackUrl = track.querySelector('url')?.textContent; // Get the URL

            // Skip this track if it has no URL or the URL is just '#'
            if (!trackUrl || trackUrl === '#') {
                return;
            }

            const playlist = {
                title: `${title} - ${artist}`,
                description: `Track by ${artist}`,
                url: trackUrl
            };
            const newCard = createPlaylistCard(playlist);
            playlistCardsContainer.appendChild(newCard);
        });

        playlistCardsContainer.style.display = 'flex'; // Display the container with new cards
    } catch (error) {
        console.error('Error fetching music:', error);
        alert('Failed to fetch music. Please try again later.');
        playlistCardsContainer.style.display = 'block'; // Ensure container is visible to show error or no results
    }
});

moodButtons.forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent.trim();
        const selectedColor = moodColors[buttonText] || '#007bff'; // Default blue if not found
        const lighterColor = lightenColor(selectedColor, 0.3); // Lighten by 30%

        moodButtons.forEach(btn => {
            if (btn !== button) {
                btn.style.backgroundColor = '#6c757d'; // Deselected color
                btn.style.color = '#e9ecef';
            } else {
                btn.style.backgroundColor = selectedColor; // Apply specific mood color
                btn.style.color = 'white';
            }
        });

        // Update body background with a gradient
        if (document.body) {
            document.body.style.background = `linear-gradient(to bottom right, ${lighterColor}, ${selectedColor})`;
        }
    });
});;
