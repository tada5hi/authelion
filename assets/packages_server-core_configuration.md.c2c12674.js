import{_ as s,o as n,c as a,f as o}from"./app.4888b77d.js";const A=JSON.parse('{"title":"Configuration","description":"","frontmatter":{},"headers":[{"level":2,"title":"Extend loaded config","slug":"extend-loaded-config"},{"level":2,"title":"Environment Variables","slug":"environment-variables"}],"relativePath":"packages/server-core/configuration.md"}'),l={name:"packages/server-core/configuration.md"},e=o(`<h1 id="configuration" tabindex="-1">Configuration <a class="header-anchor" href="#configuration" aria-hidden="true">#</a></h1><p>The package can be configured by using the <code>setConfig</code> method, which is exposed by the module.</p><div class="warning custom-block"><p class="custom-block-title">Important</p><p>It is important to set the configuration in the entrypoint of the application, before registering any sub-modul (http or database) is used.</p></div><p>All options inherit <strong>default</strong> values, so it is not mandatory to pass any option at all. To get an insight of a full list of options, which can be passed to the method, check out the <a href="./api-reference-config.html#config">API Reference</a>.</p><div class="language-typescript"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">setConfig</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@authelion/server-core</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">setConfig</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">env</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">development</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">port</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">3010</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#676E95;font-style:italic;">/* ... */</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span></code></pre></div><h2 id="extend-loaded-config" tabindex="-1">Extend loaded config <a class="header-anchor" href="#extend-loaded-config" aria-hidden="true">#</a></h2><p>It is also possible to extend the configuration found on the file system and from the environment variables.</p><div class="language-typescript"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">loadConfig</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">setConfig</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@authelion/server-core</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">(</span><span style="color:#C792EA;">async</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">config</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;font-style:italic;">await</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">loadConfig</span><span style="color:#F07178;">()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#82AAFF;">setConfig</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">...</span><span style="color:#A6ACCD;">config</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        env</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">development</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        port</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">3010</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><h2 id="environment-variables" tabindex="-1">Environment Variables <a class="header-anchor" href="#environment-variables" aria-hidden="true">#</a></h2><p>It is also possible to fill the configuration values by <strong>env</strong> key value pairs.</p><ul><li><code>NODE_ENV</code></li><li><code>PORT</code></li><li><code>SELF_URL</code></li><li><code>WEB_URL</code></li><li><code>WRITABLE_DIRECTORY_PATH</code></li><li><code>ACCESS_TOKEN_MAX_AGE</code></li><li><code>REFRESH_TOKEN_MAX_AGE</code></li><li><code>ADMIN_USERNAME</code></li><li><code>ADMIN_PASSWORD</code></li><li><code>ROBOT_ENABLED</code></li><li><code>ROBOT_SECRET</code></li><li><code>PERMISSIONS</code></li></ul>`,11),p=[e];function t(c,r,i,y,D,F){return n(),a("div",null,p)}var C=s(l,[["render",t]]);export{A as __pageData,C as default};
