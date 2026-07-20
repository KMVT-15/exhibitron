
#define USE_WEBCAM

const float speed = 24.0;

float offset (float z) {
    return sin(z * 0.1) * 24.0*cos(z*0.01);
}

float scene (vec3 o, vec3 d) {
    float r = -(o.y)/(d.y);
    return r;
}

#define nyanZ iTime*speed+4.0+16.0*(sin(iTime)*0.5+0.5)

float nyanCat (vec3 o, vec3 d) {
    float nyan = (nyanZ-o.z)/(d.z);
  	return nyan;
}

float fogCont (vec3 eye, vec3 point) {
    return exp(-max(0.0, length(point-eye) - 16.0) * 0.05);
}

int roadPart (vec3 point) {
    float c = abs(point.x + offset(point.z));
    if (c < 0.25 && mod(point.z, 8.0) < 4.0) return 3;
    if (abs(c-11.0) < 0.25) return 5;
    if (c < 12.0) return 1;
    if (c < 14.0) return 2;
    return -1;
}

vec3 color (vec2 uv) {
    vec3 fog = vec3(0.25, 0.0, 0.5);

    vec3 eye = vec3(0.0, 3.5, iTime * speed);
    eye.x = offset(-eye.z)*1.25;

    vec3 color = mix(fog*vec3(1.25, 1.25, 0.5), fog, uv.y);
    float mx = uv.x+offset(eye.z)*0.05;
    if (uv.y < 0.5+(sin(mx*1.0)+sin(mx*4.0)*2.0+sin(mx*16.0))*0.075)
        color *= 2.0;
    
    vec3 o = eye + vec3(uv, 0.0);				
    vec3 d = normalize(vec3(uv.x + offset(eye.z)*0.1, uv.y, 1.0));
    
    //if (d.y < 0.0) {
        float r = scene(o, d);
        if (r > 0.0) {
            vec3 p = o+d*r;
            int road = roadPart(p);
            color = texture(iChannel0, p.xz * 0.00125).rgb;//vec3(0.0, 0.25, 0.0);
            if (road == 1) {
                color = mix(vec3(0.1), vec3(0.35), texture(iChannel1, p.xz * 0.125).r);   
            } else if (road == 2) {
                //texture(iChannel2, p.xz * 0.0025).rgb;
                if (mod(p.z, 4.0) < 2.0) color = vec3(1.0,0.0,0.0);
                else color = vec3(1.0);
            } else if (road == 3) {
                color = vec3(1.0);
            } else if (road == 4) {
                color = vec3(1.0);
            } else if (road == 5) {
                color = texture(iChannel1, p.xz * 0.125).rgb*vec3(1.0,1.0,0.0);
            }
            color = mix(color, fog, 1.0-fogCont(p, eye));
        }
    
        float cat = nyanCat(o, d);
        if ((r < 0.0 && cat > 0.0) || (r > 0.0 && cat > 0.0 && cat < r)) {
            vec3 p = o+d*cat;
            p.y -= 3.0;
            if (abs(p.x+offset(nyanZ)) < 4.0 && abs(p.y) < 4.0) {
                vec2 cat = p.xy;
                cat.x += offset(nyanZ);
                cat.x /= 8.0;
                cat.y /= 6.0;
                #ifdef USE_WEBCAM
                cat += 0.5;
                vec4 catTex = texture(iChannel2, cat);
                #else
                cat += 0.5;
                cat.y = 1.0-cat.y;
                if (mod(p.z, 100.0) < 50.0) cat.x = 1.0-cat.x;
                float frame = floor(mod(iTime*16.0, 6.0));
                float fl = 40.0/256.0;
                cat.x = mix(fl*frame, fl*(frame+1.0), cat.x);
                vec4 catTex = texture(iChannel3, cat);
                #endif
                color = mix(color, catTex.rgb, catTex.a);
                if (catTex.a > 0.0)
                    color = mix(color, fog, 1.0-fogCont(p, eye));
            }
        }
    //}  
    return color;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
//void main(void)
{
    vec2 uv = fragCoord.xy/iResolution.xy*2.0-1.0;
    float aspect = iResolution.x/iResolution.y;
    uv.x *= aspect;
    
    uv.x += sin(uv.y * 4.0 + iTime) * 0.05;
    uv.y += cos(uv.x * 2.0 + iTime) * 0.025;
   
    float ccR = color(uv).r;
    float ccG = color(uv + vec2(0.1, 0.1*sin(4.0*iTime))*0.5).g;
    float ccB = color(uv - vec2(0.05, 0.1*cos(4.0*iTime))*0.5).b;
    
	fragColor = vec4(ccR, ccG, ccB,1.0);
}