import{_ as s,o as a,c as n,f as o}from"./app.4888b77d.js";const C=JSON.parse('{"title":"Socket","description":"","frontmatter":{},"headers":[{"level":2,"title":"Configuration","slug":"configuration"}],"relativePath":"packages/server-adapter/socket.md"}'),e={name:"packages/server-adapter/socket.md"},l=o(`<h1 id="socket" tabindex="-1">Socket <a class="header-anchor" href="#socket" aria-hidden="true">#</a></h1><p>The socket middleware should be injected at the beginning of the chain.</p><p>Besides, validating the authorization header, the <code>setupSocketMiddleware</code> also extends the request with general information (realm, abilities, ...) and information about the corresponding robot or user of the token.</p><p>The following guides are based on some shared assumptions:</p><ul><li>API URL: <code>http://localhost:3002/</code></li></ul><h2 id="configuration" tabindex="-1">Configuration <a class="header-anchor" href="#configuration" aria-hidden="true">#</a></h2><p>The <code>setupSocketMiddleware</code> method, accepts a configuration object for the http- and redis-client. The redis client, if enabled, is used to cache verification responses from the backend service.</p><div class="language-typescript"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">Server</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">socket.io</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">setupSocketMiddleware</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@authelion/server-adapter</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">createClient</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">redis-extension</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> axios </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">axios</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// create http client</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> http </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> axios</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">create</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">baseURL</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">http://localhost:3002/</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// create redis client</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> redis </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">createClient</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span><span style="color:#F07178;">connectionString</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">redis://127.0.0.1</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// setup socket.io server</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> server </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Server</span><span style="color:#A6ACCD;">()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// setup socket middleware for socket server</span></span>
<span class="line"><span style="color:#A6ACCD;">server</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">use</span><span style="color:#A6ACCD;">(</span><span style="color:#82AAFF;">setupSocketMiddleware</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    redis</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    http</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#676E95;font-style:italic;">/* ... */</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">))</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// ...</span></span>
<span class="line"></span></code></pre></div><p>For more details check out, the <a href="./.html">API Reference</a>.</p>`,9),p=[l];function t(c,r,i,D,y,F){return a(),n("div",null,p)}var d=s(e,[["render",t]]);export{C as __pageData,d as default};
