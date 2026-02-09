const API_URL = 'https://catfact.ninja/fact';

async function fetchCatFact() {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.fact;
  } catch (error) {
    console.error('Error fetching cat fact:', error);
    return 'Could not fetch a cat fact. Please try again.';
  }
}

async function displayNewFact() {
  const factElement = document.getElementById('fact-text');
  factElement.textContent = 'Loading...';
  
  const newFact = await fetchCatFact();
  factElement.textContent = newFact;
}

document.addEventListener('DOMContentLoaded', () => {
  displayNewFact();
  
  const button = document.getElementById('get-new-button');
  button.addEventListener('click', displayNewFact);
});
