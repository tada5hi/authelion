import{_ as s,o as a,c as n,f as e}from"./app.4888b77d.js";const A=JSON.parse('{"title":"Getting started","description":"","frontmatter":{},"headers":[{"level":2,"title":"Step. 1: Create a new project","slug":"step-1-create-a-new-project"},{"level":2,"title":"Step. 2: Installation","slug":"step-2-installation"},{"level":2,"title":"Step. 3: Configuration","slug":"step-3-configuration"},{"level":2,"title":"Step. 4: Boot up","slug":"step-4-boot-up"}],"relativePath":"packages/server/getting-started.md"}'),p={name:"packages/server/getting-started.md"},l=e(`<h1 id="getting-started" tabindex="-1">Getting started <a class="header-anchor" href="#getting-started" aria-hidden="true">#</a></h1><p>This section will help to spin up an authentication- &amp; authorization-server <strong>locally</strong>. To deploy the server for production, it is recommended to use the docker <a href="./deploying.html">image</a>, which can also be used for local usage.</p><h2 id="step-1-create-a-new-project" tabindex="-1">Step. 1: Create a new project <a class="header-anchor" href="#step-1-create-a-new-project" aria-hidden="true">#</a></h2><p>Create and change into a new directory.</p><div class="language-bash"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">$ mkdir auth-server </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">cd</span><span style="color:#A6ACCD;"> auth-server</span></span>
<span class="line"></span></code></pre></div><p>Then, initialize with your preferred package manager.</p><div class="language-bash"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">$ npm init</span></span>
<span class="line"></span></code></pre></div><h2 id="step-2-installation" tabindex="-1">Step. 2: Installation <a class="header-anchor" href="#step-2-installation" aria-hidden="true">#</a></h2><p>Add this package as dependency to the project.</p><div class="language-sh"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">$ npm install @authelion/server --save</span></span>
<span class="line"></span></code></pre></div><h2 id="step-3-configuration" tabindex="-1">Step. 3: Configuration <a class="header-anchor" href="#step-3-configuration" aria-hidden="true">#</a></h2><div class="info custom-block"><p class="custom-block-title">Information</p><p>In general <strong>no</strong> configuration file is required at all! All options have either default values or are generated automatically \u{1F525}.</p></div><p>To overwrite the default (generated) config property values, create a <code>authelion.config.js</code> file in the root directory with the following content:</p><div class="language-typescript"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">module.exports</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">port</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">3010</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">admin</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F07178;">username</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">admin</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F07178;">password</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">start123</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">},</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">selfUrl</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">http://127.0.0.1:3010/</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">webUrl</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">http://127.0.0.1:3000/</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#676E95;font-style:italic;">/* ... */</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>Another way is e.g. to place an <code>.env</code> file in the root-directory or provide these properties by the system environment.</p><div class="language-text"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">PORT=3010</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">ADMIN_USERNAME=admin</span></span>
<span class="line"><span style="color:#A6ACCD;">ADMIN_PASSWORD=start123</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">SELF_URL=http://127.0.0.1:3010/</span></span>
<span class="line"><span style="color:#A6ACCD;">WEB_URL=http://127.0.0.1:3000/</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h2 id="step-4-boot-up" tabindex="-1">Step. 4: Boot up <a class="header-anchor" href="#step-4-boot-up" aria-hidden="true">#</a></h2><p>Add some scripts to <code>package.json</code>.</p><div class="language-json"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  ...</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">scripts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">setup</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">authelion setup</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">start</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">authelion start</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">upgrade</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">authelion upgrade</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">  ...</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>Setup the authentication &amp; authorization service.</p><div class="language-shell"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">$ npm run setup</span></span>
<span class="line"></span></code></pre></div><p>The output should be similar, with other values for the <code>Robot ID</code> and <code>Robot Secret</code>:</p><div class="language-shell"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">\u2714 Generated rsa key-pair.</span></span>
<span class="line"><span style="color:#A6ACCD;">\u2714 Created database.</span></span>
<span class="line"><span style="color:#A6ACCD;">\u2714 Synchronized database schema.</span></span>
<span class="line"><span style="color:#A6ACCD;">\u2714 Seeded database.</span></span>
<span class="line"><span style="color:#A6ACCD;">\u2139 Robot ID: 51dc4d96-f122-47a8-92f4-f0643dae9be5</span></span>
<span class="line"><span style="color:#A6ACCD;">\u2139 Robot Secret: d1l33354crj1kyo58dbpflned2ocnw2yez69</span></span>
<span class="line"></span></code></pre></div><p>Finally, start the service:</p><div class="language-shell"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">$ npm run start</span></span>
<span class="line"></span></code></pre></div><p>It will output the following information on startup:</p><div class="language-shell"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">\u2139 Environment: development</span></span>
<span class="line"><span style="color:#A6ACCD;">\u2139 WritableDirectory: writable</span></span>
<span class="line"><span style="color:#A6ACCD;">\u2139 URL: http://127.0.0.1:3010/</span></span>
<span class="line"><span style="color:#A6ACCD;">\u2139 Docs-URL: http://127.0.0.1:3010/docs</span></span>
<span class="line"><span style="color:#A6ACCD;">\u2139 Web-URL: http://127.0.0.1:3000/</span></span>
<span class="line"><span style="color:#A6ACCD;">\u2714 Initialised controllers </span><span style="color:#89DDFF;">&amp;</span><span style="color:#A6ACCD;"> middlewares.</span></span>
<span class="line"><span style="color:#A6ACCD;">\u2714 Established database connection.</span></span>
<span class="line"><span style="color:#A6ACCD;">\u2714 Built </span><span style="color:#89DDFF;">&amp;</span><span style="color:#A6ACCD;"> started token aggregator.</span></span>
<span class="line"><span style="color:#A6ACCD;">\u2714 Startup completed.</span></span>
<span class="line"></span></code></pre></div><p>The service will spin up at the following address: <code>http://127.0.0.1:3010</code>. The swagger documentation is available at: <code>http://127.0.0.1:3010/docs</code>.</p>`,28),o=[l];function t(c,r,i,D,y,d){return a(),n("div",null,o)}var F=s(p,[["render",t]]);export{A as __pageData,F as default};