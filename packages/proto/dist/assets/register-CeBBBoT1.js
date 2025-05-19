import{i as p,a as f,x as c,n as m,r as d,d as l,b}from"./state-Cs85tckI.js";var v=Object.defineProperty,o=(h,e,t,i)=>{for(var r=void 0,a=h.length-1,u;a>=0;a--)(u=h[a])&&(r=u(e,t,r)||r);return r&&v(e,t,r),r};const n=class n extends p{constructor(){super(...arguments),this.redirect="/",this.formData={}}get canSubmit(){return this.formData.username&&this.formData.password}render(){return c`
      <form
        @change=${e=>this.handleChange(e)}
        @submit=${e=>this.handleSubmit(e)}
      >
        <slot></slot>
        <slot name="button">
          <button type="submit" ?disabled=${!this.canSubmit}>Register</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}handleChange(e){const t=e.target,i=t==null?void 0:t.name,r=t==null?void 0:t.value,a=this.formData;(i==="username"||i==="password")&&(this.formData={...a,[i]:r})}handleSubmit(e){e.preventDefault(),!(!this.canSubmit||!this.api)&&fetch(this.api,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(t=>{if(t.status!==201)throw new Error("Registration failed");return t.json()}).then(({token:t})=>{this.dispatchEvent(new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:t,redirect:this.redirect}]}))}).catch(t=>{this.error=t.message})}};n.styles=f`
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 300px;
      margin: auto;
    }

    .error {
      color: red;
    }
  `;let s=n;o([m()],s.prototype,"api");o([m()],s.prototype,"redirect");o([d()],s.prototype,"formData");o([d()],s.prototype,"error");customElements.define("register-form",s);l({"mu-auth":b.Provider,"register-form":s});
