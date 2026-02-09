const GITHUB_API_BASE = 'https://api.github.com/users';

// Function to fetch GitHub user profile
async function fetchUserProfile(username) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/${username}`);
    
    if (response.status === 404) {
      throw new Error(`User "${username}" not found on GitHub`);
    }
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

async function fetchUserRepos(username) {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/${username}/repos?sort=created&per_page=5`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch repositories: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

function renderProfile(user) {
  const profileContainer = document.getElementById('profile-container');
  
  const profileHTML = `
    <div class="profile-card">
      <img src="${user.avatar_url}" alt="${user.login}" class="avatar">
      <div class="profile-info">
        <h2>${user.name || user.login}</h2>
        <p class="username">@${user.login}</p>
        ${user.bio ? `<p class="bio">${user.bio}</p>` : ''}
        <div class="stats">
          <div class="stat">
            <span class="stat-value">${user.followers}</span>
            <span class="stat-label">Followers</span>
          </div>
          <div class="stat">
            <span class="stat-value">${user.following}</span>
            <span class="stat-label">Following</span>
          </div>
          <div class="stat">
            <span class="stat-value">${user.public_repos}</span>
            <span class="stat-label">Public Repos</span>
          </div>
        </div>
        ${user.location ? `<p class="location">📍 ${user.location}</p>` : ''}
        ${user.blog ? `<p class="link">🔗 <a href="${user.blog}" target="_blank">${user.blog}</a></p>` : ''}
      </div>
    </div>
  `;
  
  profileContainer.innerHTML = profileHTML;
}

function renderRepos(repos) {
  const reposContainer = document.getElementById('repos-container');
  
  if (repos.length === 0) {
    reposContainer.innerHTML = '<p class="no-repos">No repositories found</p>';
    return;
  }
  
  const reposHTML = `
    <div class="repos-list">
      <h3>Latest Repositories</h3>
      ${repos.map(repo => `
        <div class="repo-card">
          <div class="repo-header">
            <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
            ${repo.language ? `<span class="language">${repo.language}</span>` : ''}
          </div>
          ${repo.description ? `<p class="repo-description">${repo.description}</p>` : ''}
          <div class="repo-stats">
            <span class="repo-stat">⭐ ${repo.stargazers_count}</span>
            <span class="repo-stat">🔀 ${repo.forks_count}</span>
            ${repo.open_issues_count ? `<span class="repo-stat">📋 ${repo.open_issues_count}</span>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  reposContainer.innerHTML = reposHTML;
}

function displayError(message) {
  const profileContainer = document.getElementById('profile-container');
  const reposContainer = document.getElementById('repos-container');
  
  profileContainer.innerHTML = `<div class="error-message">❌ ${message}</div>`;
  reposContainer.innerHTML = '';
}

// Main search function
async function searchUser(username) {
  if (!username.trim()) {
    displayError('Please enter a GitHub username');
    return;
  }
  
  try {
    // Show loading state
    const profileContainer = document.getElementById('profile-container');
    profileContainer.innerHTML = '<p class="loading">Loading...</p>';
    document.getElementById('repos-container').innerHTML = '';
    
    // Fetch both user profile and repos
    const [userProfile, userRepos] = await Promise.all([
      fetchUserProfile(username),
      fetchUserRepos(username)
    ]);
    
    // Render the results
    renderProfile(userProfile);
    renderRepos(userRepos);
  } catch (error) {
    displayError(error.message);
  }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('username-input');
  const searchButton = document.getElementById('search-button');
  
  // Search on button click
  searchButton.addEventListener('click', () => {
    searchUser(searchInput.value);
  });
  
  // Search on Enter key
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchUser(searchInput.value);
    }
  });
  
  // Clear results when input is cleared
  searchInput.addEventListener('input', (e) => {
    if (!e.target.value.trim()) {
      document.getElementById('profile-container').innerHTML = '';
      document.getElementById('repos-container').innerHTML = '';
    }
  });
});
