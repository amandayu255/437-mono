import{i as h,a as l,x as p,r as u,n as c,d as f,b}from"./state-Cs85tckI.js";var g=Object.defineProperty,s=(n,t,r,d)=>{for(var e=void 0,a=n.length-1,m;a>=0;a--)(m=n[a])&&(e=m(t,r,e)||e);return e&&g(t,r,e),e};const i=class i extends h{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return this.formData.username&&this.formData.password}render(){return p`
      <form
        @change=${t=>this.handleChange(t)}
        @submit=${t=>this.handleSubmit(t)}
      >
        <slot></slot>
        <slot name="button">
          <button type="submit" ?disabled=${!this.canSubmit}>Register</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}handleChange(t){const r=t.target,d=r==null?void 0:r.name,e=r==null?void 0:r.value,a=this.formData;switch(d){case"username":this.formData={...a,username:e};break;case"password":this.formData={...a,password:e};break}}handleSubmit(t){t.preventDefault(),!(!this.canSubmit||!this.api)&&fetch(this.api,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(r=>{if(r.status!==201)throw new Error("Registration failed");return r.json()}).then(({token:r})=>{this.dispatchEvent(new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:r,redirect:this.redirect}]}))}).catch(r=>{this.error=r.message})}};i.styles=l`
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
  `;let o=i;s([u()],o.prototype,"formData");s([c()],o.prototype,"api");s([c()],o.prototype,"redirect");s([u()],o.prototype,"error");customElements.define("register-form",o);f({"mu-auth":b.Provider,"register-form":o});
