import{i as m,a as h,x as p,r as l,n as u,d as f,b}from"./state-Cs85tckI.js";var g=Object.defineProperty,i=(d,r,t,a)=>{for(var e=void 0,s=d.length-1,c;s>=0;s--)(c=d[s])&&(e=c(r,t,e)||e);return e&&g(r,t,e),e};const n=class n extends m{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return p`
      <form
        @change=${r=>this.handleChange(r)}
        @submit=${r=>this.handleSubmit(r)}
      >
        <slot></slot>
        <slot name="button">
          <button type="submit" ?disabled=${!this.canSubmit}>Login</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}handleChange(r){const t=r.target,a=t==null?void 0:t.name,e=t==null?void 0:t.value,s=this.formData;switch(a){case"username":this.formData={...s,username:e};break;case"password":this.formData={...s,password:e};break}}handleSubmit(r){r.preventDefault(),this.canSubmit&&fetch((this==null?void 0:this.api)||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(t=>{if(t.status!==200)throw"Login failed";return t.json()}).then(t=>{const{token:a}=t,e=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:a,redirect:this.redirect}]});console.log("dispatching message",e),this.dispatchEvent(new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:a,redirect:this.redirect}]}))}).catch(t=>{console.log(t),this.error=t.toString()})}};n.styles=h`
    :host {
      display: block;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 320px;
      margin: auto;
      padding: 1rem;
    }

    label {
      display: flex;
      flex-direction: column;
      font-weight: 600;
      font-size: 0.9rem;
      gap: 0.5rem;
    }

    input {
      padding: 0.5rem;
      border-radius: 0.25rem;
      border: 1px solid #ccc;
      font-size: 1rem;
    }

    button {
      background-color: var(--color-primary, #00449e);
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 0.25rem;
      font-size: 1rem;
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .error {
      color: var(--color-error, red);
      font-weight: bold;
      text-align: center;
    }
  `;let o=n;i([l()],o.prototype,"formData");i([u()],o.prototype,"api");i([u()],o.prototype,"redirect");i([l()],o.prototype,"error");customElements.define("login-form",o);f({"mu-auth":b.Provider,"login-form":o});
