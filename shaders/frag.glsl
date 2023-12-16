precision highp float;

uniform sampler2D tDiffuse;

varying vec2 vUv;

void main(){
    vec4 newUv=texture2D(tDiffuse,vUv);
    
    vec4 color=newUv;
    
    vec3 color_resolution=vec3(8.,8.,4.);
    vec3 color_bands=floor(color.rgb*color_resolution)/(color_resolution-1.);
    gl_FragColor=vec4(min(color_bands,1.),color.a);
}