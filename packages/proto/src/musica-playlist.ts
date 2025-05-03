import { html, css, LitElement } from "lit";

export class MusicaPlaylistElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 2rem;
    }

    .columns {
      display: flex;
      gap: 4rem;
      justify-content: center;
      align-items: flex-start; /* 👈 add this */
      flex-wrap: wrap;
    }

    .column {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 220px;
    }

    h2 {
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
      text-align: center;
    }

    .column h2 {
  margin-bottom: 1rem;
}


    @media (max-width: 600px) {
      .columns {
        flex-direction: column;
        align-items: center;
        gap: 2rem;
      }

      .column {
        width: 100%;
        align-items: center;
      }
    }
  `;

  users: Array<{ href: string; label: string }> = [];
  playlists: Array<{ href: string; label: string }> = [];

  connectedCallback(): void {
    super.connectedCallback();
    this.hydrate("/data/playlists.json");
  }

  async hydrate(src: string) {
    const res = await fetch(src);
    const json = await res.json();
    this.users = json.users || [];
    this.playlists = json.playlists || [];
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="columns">
        <div class="column">
          <h2>Users</h2>
          ${this.users.map(
            (item) => html`
              <musica-link href=${item.href} label=${item.label}></musica-link>
            `
          )}
        </div>
        <div class="column">
          <h2>Playlists</h2>
          ${this.playlists.map(
            (item) => html`
              <musica-link href=${item.href} label=${item.label}></musica-link>
            `
          )}
        </div>
      </div>
    `;
  }
}

customElements.define("musica-playlist", MusicaPlaylistElement);
