import { LitElement, html, css } from "lit";

export class HomeViewElement extends LitElement {
  static styles = css`
    .grid {
      display: flex;
      justify-content: center;
      gap: 4rem;
      padding: 2rem;
      flex-wrap: wrap;
    }

    .column {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .card {
      background-color: #d9f2e6;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      text-align: center;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      font-weight: bold;
      color: #2d2d2d;
      text-decoration: none;
    }
  `;

  render() {
    return html`
      <section class="grid">
        <div class="column">
          <h2>Users</h2>
          <div class="card">User: Amanda Yu</div>
        </div>
        <div class="column">
          <h2>Playlists</h2>
          <a href="/app/playlist/pop" class="card">Playlist: Pop</a>
          <a href="/app/playlist/jazz" class="card">Playlist: Jazz</a>
          <a href="/app/playlist/rock" class="card">Playlist: Rock</a>
        </div>
      </section>
    `;
  }
}

customElements.define("home-view", HomeViewElement);
