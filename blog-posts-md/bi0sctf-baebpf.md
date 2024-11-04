---
title: "[BI0SCTF] BaeBPF"
date: "25 February 2024"
toc: true
images:
author: "Tzion"
origsrc: "https://tzion0.github.io/posts/bi0sctf2024-baebpf/"
category: "REV"
tags:
  - BI0SCTF
  - REV
  - 2024
---

This challenge only provided a instance deployment.

Please note that I did not solve this challenge during the competition, only solved it by gaining some extra details after the competition.

## Level 1
Connecting to the challenge deployment, we get to choose the following options:
```
1. Generate assembly dump
2. cat any file
```

By dumping the assembly, we can see the follow:
```
Assembly dump of the program
========================================Asm dump=========================================
 int syscall__trace_entry_openat(struct pt_regs * ctx):
; struct pt_regs * __ctx = ctx->di
0: (79) r6 = *(u64 *)(r1 +112)
; int dfd; bpf_probe_read(&dfd, sizeof(dfd), &__ctx->di)
1: (bf) r3 = r6
2: (07) r3 += 112
3: (bf) r1 = r10
4: (07) r1 += -4
; int dfd; bpf_probe_read(&dfd, sizeof(dfd), &__ctx->di)
5: (b7) r2 = 4
6: (85) call bpf_probe_read_compat#-115168
; const char __user *filename; bpf_probe_read(&filename, sizeof(filename), &__ctx->si)
7: (bf) r3 = r6
8: (07) r3 += 104
9: (bf) r1 = r10
10: (07) r1 += -16
; const char __user *filename; bpf_probe_read(&filename, sizeof(filename), &__ctx->si)
11: (b7) r2 = 8
12: (85) call bpf_probe_read_compat#-115168
; int flags; bpf_probe_read(&flags, sizeof(flags), &__ctx->dx)
13: (07) r6 += 96
14: (bf) r1 = r10
15: (07) r1 += -20
; int flags; bpf_probe_read(&flags, sizeof(flags), &__ctx->dx)
16: (b7) r2 = 4
17: (bf) r3 = r6
18: (85) call bpf_probe_read_compat#-115168
19: (b7) r6 = 0
20: (73) *(u8 *)(r10 -24) = r6
21: (79) r3 = *(u64 *)(r10 -16)
22: (bf) r1 = r10
23: (07) r1 += -24
24: (b7) r2 = 1
25: (85) call bpf_probe_read_compat#-115168
26: (71) r1 = *(u8 *)(r10 -24)
27: (55) if r1 != 0x66 goto pc+368
28: (73) *(u8 *)(r10 -24) = r6
29: (79) r3 = *(u64 *)(r10 -16)
30: (07) r3 += 1
31: (bf) r1 = r10
32: (07) r1 += -24
33: (b7) r2 = 1
34: (85) call bpf_probe_read_compat#-115168
35: (71) r1 = *(u8 *)(r10 -24)
36: (55) if r1 != 0x6c goto pc+359
37: (b7) r6 = 0
38: (73) *(u8 *)(r10 -24) = r6
39: (79) r3 = *(u64 *)(r10 -16)
40: (07) r3 += 2
41: (bf) r1 = r10
42: (07) r1 += -24
43: (b7) r2 = 1
44: (85) call bpf_probe_read_compat#-115168
45: (71) r1 = *(u8 *)(r10 -24)
46: (55) if r1 != 0x61 goto pc+349
47: (73) *(u8 *)(r10 -24) = r6
48: (79) r3 = *(u64 *)(r10 -16)
49: (07) r3 +=3
50: (bf) r1 = r10
51: (07) r1 += -24
52: (b7) r2 = 1
53: (85) call bpf_probe_read_compat#-115168
54: (71) r1 = *(u8 *)(r10 -24)
55: (55) if r1 != 0x67 goto pc+340
56: (b7) r6 = 0
57: (73) *(u8 *)(r10 -24) = r6
58: (79) r3 = *(u64 *)(r10 -16)
59: (07) r3 += 4
60: (bf) r1 = r10
61: (07) r1 += -24
62: (b7) r2 = 1
63: (85) call bpf_probe_read_compat#-115168
64: (71) r1 = *(u8 *)(r10 -24)
65: (55) if r1 != 0x2e goto pc+330
66: (73) *(u8 *)(r10 -24) = r6
67: (79) r3 = *(u64 *)(r10 -16)
68: (07) r3 += 5
69: (bf) r1 = r10
70: (07) r1 += -24
71: (b7) r2 = 1
72: (85) call bpf_probe_read_compat#-115168
73: (71) r1 = *(u8 *)(r10 -24)
74: (55) if r1 != 0x74 goto pc+321
75: (b7) r6 = 0
76: (73) *(u8 *)(r10 -24) = r6
77: (79) r3 = *(u64 *)(r10 -16)
78: (07) r3 += 6
79: (bf) r1 = r10
80: (07) r1 += -24
81: (b7) r2 = 1
82: (85) call bpf_probe_read_compat#-115168
83: (71) r1 = *(u8 *)(r10 -24)
84: (55) if r1 != 0x78 goto pc+311
85: (73) *(u8 *)(r10 -24) = r6
86: (79) r3 = *(u64 *)(r10 -16)
87: (07) r3 += 7
88: (bf) r1 = r10
89: (07) r1 += -24
90: (b7) r2 = 1
91: (85) call bpf_probe_read_compat#-115168
92: (71) r1 = *(u8 *)(r10 -24)
93: (55) if r1 != 0x74 goto pc+302
94: (b7) r8 = 0
95: (63) *(u32 *)(r10 -24) = r8
96: (18) r1 = map[id:4]
98: (bf) r7 = r10
99: (07) r7 += -24
100: (bf) r2 = r7
101: (07) r1 += 272
102: (61) r0 = *(u32 *)(r2 +0)
103: (35) if r0 >= 0x8 goto pc+3
104: (67) r0 <<=3
105: (0f) r0 += r1
106: (05) goto pc+1
107: (b7) r0 = 0
108: (bf) r6 = r0
109: (18) r1 = map[id:3]
111: (bf) r2 = r7
112: (07) r1 += 272
113: (61) r0 = *(u32 *)(r2 +0)
114: (35) if r0 >= 0x8 goto pc+3
115: (67) r0 <<=3
116: (0f) r0 += r1
117: (05) goto pc+1
118: (b7) r0 = 0
119: (b7) r1 = 0
120: (15) if r6 == 0x0 goto pc+2
121: (61) r1 = *(u32 *)(r6 +0)
122: (a7) r1 ^= 5
123: (15) if r0 == 0x0 goto pc+6
124: (61) r2 = *(u32 *)(r0 +0)
125: (67) r1 <<=32
126: (77) r1 >>=32
127: (b7) r8 = 1
128: (1d) if r1 == r2 goto pc+1
129: (b7) r8 = 0
130: (b7) r1 = 1
131: (63) *(u32 *)(r10 -24) = r1
132: (18) r1 = map[id:4]
134: (bf) r7 = r10
135: (07) r7 += -24
136: (bf) r2 = r7
137: (07) r1 += 272
138: (61) r0 = *(u32 *)(r2 +0)
139: (35) if r0 >= 0x8 goto pc+3
140: (67) r0 <<=3
141: (0f) r0 += r1
142: (05) goto pc+1
143: (b7) r0 = 0
144: (bf) r6 = r0
145: (18) r1 = map[id:3]
147: (bf) r2 = r7
148: (07) r1 += 272
149: (61) r0 = *(u32 *)(r2 +0)
150: (35) if r0 >= 0x8 goto pc+3
151: (67) r0 <<=3
152: (0f) r0 += r1
153: (05) goto pc+1
154: (b7) r0 = 0
155: (b7) r1 = 0
156: (15) if r6 == 0x0 goto pc+2
157: (61) r1 = *(u32 *)(r6 +0)
158: (a7) r1 ^= 5
159: (15) if r0 == 0x0 goto pc+7
160: (61) r3 = *(u32 *)(r0 +0)
161: (67) r1 <<=32
162: (77) r1 >>=32
163: (b7) r2 = 1
164: (1d) if r1 == r3 goto pc+1
165: (b7) r2 = 0
166: (0f) r8 += r2
167: (b7) r1 = 2
168: (63) *(u32 *)(r10 -24) = r1
169: (18) r1 = map[id:4]
171: (bf) r7 = r10
172: (07) r7 += -24
173: (bf) r2 = r7
174: (07) r1 += 272
175: (61) r0 = *(u32 *)(r2 +0)
176: (35) if r0 >= 0x8 goto pc+3
177: (67) r0 <<=3
178: (0f) r0 += r1
179: (05) goto pc+1
180: (b7) r0 = 0
181: (bf) r6 = r0
182: (18) r1 = map[id:3]
184: (bf) r2 = r7
185: (07) r1 += 272
186: (61) r0 = *(u32 *)(r2 +0)
187: (35) if r0 >= 0x8 goto pc+3
188: (67) r0 <<=3
189: (0f) r0 += r1
190: (05) goto pc+1
191: (b7) r0 = 0
192: (b7) r1 = 0
193: (15) if r6 == 0x0 goto pc+2
194: (61) r1 = *(u32 *)(r6 +0)
195: (a7) r1 ^= 5
196: (15) if r0 == 0x0 goto pc+7
197: (61) r3 = *(u32 *)(r0 +0)
198: (67) r1 <<=32
199: (77) r1 >>=32
200: (b7) r2 = 1
201: (1d) if r1 == r3 goto pc+1
202: (b7) r2 = 0
203: (0f) r8 += r2
204: (b7) r1 =3
205: (63) *(u32 *)(r10 -24) = r1
206: (18) r1 = map[id:4]
208: (bf) r7 = r10
209: (07) r7 += -24
210: (bf) r2 = r7
211: (07) r1 += 272
212: (61) r0 = *(u32 *)(r2 +0)
213: (35) if r0 >= 0x8 goto pc+3
214: (67) r0 <<=3
215: (0f) r0 += r1
216: (05) goto pc+1
217: (b7) r0 = 0
218: (bf) r6 = r0
219: (18) r1 = map[id:3]
221: (bf) r2 = r7
222: (07) r1 += 272
223: (61) r0 = *(u32 *)(r2 +0)
224: (35) if r0 >= 0x8 goto pc+3
225: (67) r0 <<=3
226: (0f) r0 += r1
227: (05) goto pc+1
228: (b7) r0 = 0
229: (b7) r1 = 0
230: (15) if r6 == 0x0 goto pc+2
231: (61) r1 = *(u32 *)(r6 +0)
232: (a7) r1 ^= 5
233: (15) if r0 == 0x0 goto pc+7
234: (61) r3 = *(u32 *)(r0 +0)
235: (67) r1 <<=32
236: (77) r1 >>=32
237: (b7) r2 = 1
238: (1d) if r1 == r3 goto pc+1
239: (b7) r2 = 0
240: (0f) r8 += r2
241: (b7) r1 = 4
242: (63) *(u32 *)(r10 -24) = r1
243: (18) r1 = map[id:4]
245: (bf) r7 = r10
246: (07) r7 += -24
247: (bf) r2 = r7
248: (07) r1 += 272
249: (61) r0 = *(u32 *)(r2 +0)
250: (35) if r0 >= 0x8 goto pc+3
251: (67) r0 <<=3
252: (0f) r0 += r1
253: (05) goto pc+1
254: (b7) r0 = 0
255: (bf) r6 = r0
256: (18) r1 = map[id:3]
258: (bf) r2 = r7
259: (07) r1 += 272
260: (61) r0 = *(u32 *)(r2 +0)
261: (35) if r0 >= 0x8 goto pc+3
262: (67) r0 <<=3
263: (0f) r0 += r1
264: (05) goto pc+1
265: (b7) r0 = 0
266: (b7) r1 = 0
267: (15) if r6 == 0x0 goto pc+2
268: (61) r1 = *(u32 *)(r6 +0)
269: (a7) r1 ^= 5
270: (15) if r0 == 0x0 goto pc+7
271: (61) r3 = *(u32 *)(r0 +0)
272: (67) r1 <<=32
273: (77) r1 >>=32
274: (b7) r2 = 1
275: (1d) if r1 == r3 goto pc+1
276: (b7) r2 = 0
277: (0f) r8 += r2
278: (b7) r1 = 5
279: (63) *(u32 *)(r10 -24) = r1
280: (18) r1 = map[id:4]
282: (bf) r7 = r10
283: (07) r7 += -24
284: (bf) r2 = r7
285: (07) r1 += 272
286: (61) r0 = *(u32 *)(r2 +0)
287: (35) if r0 >= 0x8 goto pc+3
288: (67) r0 <<=3
289: (0f) r0 += r1
290: (05) goto pc+1
291: (b7) r0 = 0
292: (bf) r6 = r0
293: (18) r1 = map[id:3]
295: (bf) r2 = r7
296: (07) r1 += 272
297: (61) r0 = *(u32 *)(r2 +0)
298: (35) if r0 >= 0x8 goto pc+3
299: (67) r0 <<=3
300: (0f) r0 += r1
301: (05) goto pc+1
302: (b7) r0 = 0
303: (b7) r1 = 0
304: (15) if r6 == 0x0 goto pc+2
305: (61) r1 = *(u32 *)(r6 +0)
306: (a7) r1 ^= 5
307: (15) if r0 == 0x0 goto pc+7
308: (61) r3 = *(u32 *)(r0 +0)
309: (67) r1 <<=32
310: (77) r1 >>=32
311: (b7) r2 = 1
312: (1d) if r1 == r3 goto pc+1
313: (b7) r2 = 0
314: (0f) r8 += r2
315: (b7) r1 = 6
316: (63) *(u32 *)(r10 -24) = r1
317: (18) r1 = map[id:4]
319: (bf) r7 = r10
320: (07) r7 += -24
321: (bf) r2 = r7
322: (07) r1 += 272
323: (61) r0 = *(u32 *)(r2 +0)
324: (35) if r0 >= 0x8 goto pc+3
325: (67) r0 <<=3
326: (0f) r0 += r1
327: (05) goto pc+1
328: (b7) r0 = 0
329: (bf) r6 = r0
330: (18) r1 = map[id:3]
332: (bf) r2 = r7
333: (07) r1 += 272
334: (61) r0 = *(u32 *)(r2 +0)
335: (35) if r0 >= 0x8 goto pc+3
336: (67) r0 <<=3
337: (0f) r0 += r1
338: (05) goto pc+1
339: (b7) r0 = 0
340: (b7) r1 = 0
341: (15) if r6 == 0x0 goto pc+2
342: (61) r1 = *(u32 *)(r6 +0)
343: (a7) r1 ^= 5
344: (15) if r0 == 0x0 goto pc+7
345: (61) r3 = *(u32 *)(r0 +0)
346: (67) r1 <<=32
347: (77) r1 >>=32
348: (b7) r2 = 1
349: (1d) if r1 == r3 goto pc+1
350: (b7) r2 = 0
351: (0f) r8 += r2
352: (b7) r1 = 7
353: (63) *(u32 *)(r10 -24) = r1
354: (18) r1 = map[id:4]
356: (bf) r7 = r10
357: (07) r7 += -24
358: (bf) r2 = r7
359: (07) r1 += 272
360: (61) r0 = *(u32 *)(r2 +0)
361: (35) if r0 >= 0x8 goto pc+3
362: (67) r0 <<=3
363: (0f) r0 += r1
364: (05) goto pc+1
365: (b7) r0 = 0
366: (bf) r6 = r0
367: (18) r1 = map[id:3]
369: (bf) r2 = r7
370: (07) r1 += 272
371: (61) r0 = *(u32 *)(r2 +0)
372: (35) if r0 >= 0x8 goto pc+3
373: (67) r0 <<=3
374: (0f) r0 += r1
375: (05) goto pc+1
376: (b7) r0 = 0
377: (b7) r1 = 0
378: (15) if r6 == 0x0 goto pc+2
379: (61) r1 = *(u32 *)(r6 +0)
380: (a7) r1 ^= 5
381: (55) if r0 != 0x0 goto pc+1
382: (05) goto pc+10
383: (61) r3 = *(u32 *)(r0 +0)
384: (67) r1 <<=32
385: (77) r1 >>=32
386: (b7) r2 = 1
387: (1d) if r1 == r3 goto pc+1
388: (b7) r2 = 0
389: (0f) r8 += r2
390: (67) r8 <<=32
391: (77) r8 >>=32
392: (15) if r8 == 0x8 goto pc+3
393: (85) call bpf_get_current_pid_tgid#239984
394: (b7) r1 = 9
395: (85) call bpf_send_signal#-115264
396: (b7) r0 = 0
397: (95) exit

========================================End of Assembly dump=============================


Here is the map dump
========================================MAP DUMP=========================================

 [{
        "key": 0,
        "value": 83
    },{
        "key": 1,
        "value": 108
    },{
        "key": 2,
        "value": 119
    },{
        "key": 3,
        "value": 100
    },{
        "key": 4,
        "value": 105
    },{
        "key": 5,
        "value": 108
    },{
        "key": 6,
        "value": 113
    },{
        "key": 7,
        "value": 124
    }
]
========================================END OF MAP DUMP==================================
```

I'm not an expert of this eBPF assembly therefore what I did was go through it and trying to have its control flow figured out in my mind. After spending several hours with the help of GPT, I concluded that:

- Line 0 - 18: Read the dfd, filename, and flags arguments of the openat system call using bpf_probe_read_compat
- Line 19 - 93: Check if the filename is "flag.txt"
- Line 94 - 391: Perform some operations using the map given and etc, the operation code is like follow in Python:

    ```py
    for i in range(8):
        x = i
        i <<= 3
        i += (272 + map[4])
        x <<= 3
        x += (272 + map[3])
        print(f"*({str(i)} ^ 5) == *({str(x)})")
    ```

- Line 392 - 397: Check if R8 == 0x8, if it is equal then exit with 0. This R8 is increased by 1 per iteration of character checking in memory if it is correct, unsure if the character in memory is the password we entered.

Now from the conclusion we know that we need to `cat` out the flag.txt, trying out in terminal tell us that we need a password:

![IMG1](/images/ctfs/bi0sctf2024-baeBPF/IMG1.png)

From the conclusion we also know that the password must be length of 8 and when analyzing how the password being process I'm very confused why there are a few of `(272 + map[id:?])` occurs in the code, the only way to explain that is the code is accessing certain eBPF element of map, but why it accessing only map id of 4 and 3 in the code instead of other id provided in the dump? No idea. If we print out the map values, we will get `Slwdilq|`. Anyway, with the information I obtained, I sent it to our team discord group and have a break.

When I returned from the break, my teammates [@Hen123Step](https://twitter.com/Hen123Step) figured out that the key is `Virality`, by XOR the `Slwdilq|` with 5. This immediately make sense to me if we look at the Python code above and treat those `i` and `x` as memory address instead of concrete value, but I still couldn't wrap my head around it why it looks like that, but who knows, now we can proceed with next level.

## Level 2
After entering the correct password, we are being greet with this:

![IMG2](/images/ctfs/bi0sctf2024-baeBPF/IMG2.png)

By generate the assembly dump, we get the follow:
```
Im not feeling generous, here's a part of the code
========================================Asm dump========================================

void encrypt_function():
   0: (bf) r6 = r10
   1: (07) r6 += -4
   2: (18) r9 = 0xffffffe0
   4: (b7) r8 = 0
; uint32_t v[2] = {0,0};
   5: (b7) r1 = 0
   6: (7b) *(u64 *)(r10 -8) = r1
   7: (63) *(u32 *)(r10 -12) = r8
; uint32_t *temp = bpf_map_lookup_elem((void *)bpf_pseudo_fd(1, -1), &index);
   8: (18) r1 = map[id:14]
  10: (bf) r2 = r10
  11: (07) r2 += -12
; uint32_t *temp = bpf_map_lookup_elem((void *)bpf_pseudo_fd(1, -1), &index);
  12: (07) r1 += 272
  13: (61) r0 = *(u32 *)(r2 +0)
  14: (35) if r0 >= 0x400 goto pc+3
  15: (67) r0 <<= 3
  16: (0f) r0 += r1
  17: (05) goto pc+1
  18: (b7) r0 = 0
  19: (bf) r7 = r0
; if (temp != NULL && *temp != 0)
  20: (15) if r7 == 0x0 goto pc+78
  21: (61) r1 = *(u32 *)(r7 +0)
  22: (15) if r1 == 0x0 goto pc+76
  23: (63) *(u32 *)(r10 -8) = r1
; uint32_t *temp2 = bpf_map_lookup_elem((void *)bpf_pseudo_fd(1, -2), &index);
  24: (18) r1 = map[id:13]
  26: (bf) r2 = r10
  27: (07) r2 += -12
; uint32_t *temp2 = bpf_map_lookup_elem((void *)bpf_pseudo_fd(1, -2), &index);
  28: (07) r1 += 272
  29: (61) r0 = *(u32 *)(r2 +0)
  30: (35) if r0 >= 0x400 goto pc+3
  31: (67) r0 <<= 3
  32: (0f) r0 += r1
  33: (05) goto pc+1
  34: (b7) r0 = 0
  35: (15) if r0 == 0x0 goto pc+63
  36: (61) r1 = *(u32 *)(r7 +0)
  37: (15) if r1 == 0x0 goto pc+61
  38: (b7) r1 = 32
  39: (18) r2 = 0x9e3779b9
  41: (61) r7 = *(u32 *)(r10 -8)
  42: (61) r4 = *(u32 *)(r0 +0)
  43: (63) *(u32 *)(r10 -4) = r4
  44: (bf) r3 = r4
  45: (67) r3 <<= 4
  46: (07) r3 += 305402420
  47: (bf) r5 = r4
  48: (0f) r5 += r2
  49: (af) r3 ^= r5
  50: (bf) r5 = r4
  51: (5f) r5 &= r9
  52: (77) r5 >>= 5
  53: (07) r5 += 305402420
  54: (af) r3 ^= r5
  55: (0f) r3 += r7
  56: (bf) r5 = r3
  57: (67) r5 <<= 4
  58: (07) r5 += 305402420
  59: (bf) r0 = r2
  60: (0f) r0 += r3
  61: (af) r5 ^= r0
  62: (bf) r0 = r3
  63: (5f) r0 &= r9
  64: (77) r0 >>= 5
  65: (07) r0 += 305402420
  66: (af) r5 ^= r0
  67: (0f) r5 += r4
  68: (07) r2 += -1640531527
  69: (07) r1 += -1
  70: (bf) r0 = r1
  71: (67) r0 <<= 32
  72: (77) r0 >>= 32
  73: (bf) r4 = r5
  74: (bf) r7 = r3
  75: (15) if r0 == 0x0 goto pc+1
  76: (05) goto pc-33
  77: (63) *(u32 *)(r10 -4) = r5
  78: (63) *(u32 *)(r10 -8) = r3
; bpf_map_update_elem((void *)bpf_pseudo_fd(1, -3), &index,&v[0], BPF_ANY);
  79: (18) r1 = map[id:12]
  81: (bf) r7 = r10
  82: (07) r7 += -12
  83: (bf) r3 = r10
  84: (07) r3 += -8
; bpf_map_update_elem((void *)bpf_pseudo_fd(1, -3), &index,&v[0], BPF_ANY);
  85: (bf) r2 = r7
  86: (b7) r4 = 0
  87: (85) call array_map_update_elem#296464
; bpf_map_update_elem((void *)bpf_pseudo_fd(1, -4), &index,&v[1], BPF_ANY);
  88: (18) r1 = map[id:11]
; bpf_map_update_elem((void *)bpf_pseudo_fd(1, -4), &index,&v[1], BPF_ANY);
  90: (bf) r2 = r7
  91: (bf) r3 = r6
  92: (b7) r4 = 0
  93: (85) call array_map_update_elem#296464
  94: (07) r8 += 1
  95: (bf) r1 = r8
  96: (67) r1 <<= 32
  97: (77) r1 >>= 32
  98: (55) if r1 != 0x80 goto pc-94
  99: (95) exit
```

At this point, I'm feeling quite confident in analyzing it since the code is smaller and I have general idea of what to expect after hours of analyzing level 1 assembly, but I'm quickly getting punch in the face. At first I suspect it was a modified XTEA algorithm because of the constant `0x9e3779b9`, but turns out it was TEA algorithm, let's look at a generic TEA encode function:
```c
void code(uint32_t *v, uint32_t *k)
{
    uint32_t v0 = v[0],
             v1 = v[1],
             delta = 0x9e3779b9,
             n = 32,    // Invariant: Number of bits remaining
             sum = 0;

    while(n--) {
        sum += delta;
        v0 += ((v1<<4) + k[0]) ^ (v1 + sum) ^ ((v1>>5) + k[1]);
        v1 += ((v0<<4) + k[2]) ^ (v0 + sum) ^ ((v0>>5) + k[3]);
    }
    v[0] = v0;
    v[1] = v1;
}
```

We know the delta, v0, v1 (From the PROG_2_OUTPUT given in above picture, we determine that it comes with pair, as the last pair was 0, 0). But we don't know the key yet, turns out it was the `305402420` (0x12341234), which make sense since it used 4 times. With all the information, the decode function is as follow:
```c
void decode(uint32_t v[2], uint32_t const key[4])
{
	const unsigned int num_rounds = 32;
    unsigned int i;
    uint32_t v0=v[0], v1=v[1], delta=0x9E3779B9, sum=delta*num_rounds;
    for (i=0; i < num_rounds; i++)
    {
        v1 -= ((((v0 << 4) + key[2]) ^ (v0 + sum)) ^ ((v0 >> 5) + key[3]));
        v0 -= ((((v1 << 4) + key[0]) ^ (v1 + sum)) ^ ((v1 >> 5) + key[1]));
        sum -= delta;
    }
    v[0]=v0; v[1]=v1;
}

int main() {
    long long int vals[] = {0x33ae2685,0x230bcdd5,0x4f5ac093,0x3dc3e00a,0xda19d0a1,0x32c52ad0,0xc904ffac,0x3037b842,0x9c7bf31e,0x4b8dfebc,0x33335ba7,0x4c4c9188,0xa555d9a9,0xaa069852,0xa177367f,0x79daa10f,0x29ca035c,0x319fbbc8,0xd51b4a1c,0x4a1b63b6,0x99f5d2f1,0xf35fdd82,0x7e70314f,0x42077d00,0x4f84cb2b,0x4a73846a,0xbbb0581e,0x8c33c34f,0x4eb73143,0xac45de0,0x82592087,0xc02544fa,0x56590be4,0xd2f78e08,0xb2c9d125,0x65e106d8,0x46711844,0xcf16ec7f,0xc85dde46,0x51d873d,0x50319f0f,0x8e5370bd,0x80145a76,0xbdbe90a6,0x3a10947e,0xfaf968c7,0xac700a03,0x47e061be,0xe9e65b90,0xe3c65a80,0xd707d969,0x40e93f77,0x447cf10e,0xbc69c7df,0xd8c669de,0x36c05ccf,0x876411ba,0xb37a6436,0xcdbeac33,0x7ba23db9,0xc18251bd,0x926d7a16,0x9ffb0134,0xc7f9ab96,0xc635711e,0x45b69a8,0x7b0fdd2e,0xf54849a7,0x61e5d839,0x1f12687d,0xb39a4ba1,0xd4fa2f5a,0xc308a7fd,0xcc0f199b,0x6b35768,0xecb39e48,0xb2c9d125,0x65e106d8,0x9e9a0f73,0xc58bdf39,0xa9bb76d1,0xc75ccd7,0x8473c66,0x8a4ed0e5,0xae1dcf9a,0x214f0ed5,0xfb6bf695,0x56e45cc6,0x47e4e2b9,0x8e2107d1,0x5a24b1dc,0x70599ee2,0x6cd313ec,0x4fa221e8,0x6696e856,0x62fde305,0x79958e01,0x1b99f294,0x876fd3a,0x59c1d749,0x0,0x0};
    for(int i = 0; i < sizeof(vals)/sizeof(vals[0]); i+=2) {
        uint32_t v[2] = {vals[i], vals[i+1]};
        uint32_t k[4] = {0x12341234, 0x12341234, 0x12341234, 0x12341234};
        my_decrypt(v, k);

        printf("%llx", v[0]);
        printf("%llx", v[1]);
    }
    return 0;
}
```

And we will get the following as output:
```
646566207265636375722869293a200a20202020206966286e6f742069293a0a20202020202020202072657475726e20310a202020202069662869203d3d2031293a0a20202020202020202072657475726e2020330a202020202076616c5f32203d2032202a72656363757228692d31290a202020202072657475726e2076616c5f32202b20332a2072656363757228692d3229200a2020202020657869742829200a656e635f666c6167203d205b3130322c37352c3136332c3233392c3135362c3135382c372c3134332c39322c3132302c302c35342c3138332c36352c3139392c3235332c36302c3138322c3230345d200a666f72206920696e2072616e6765283230293a0a20202020666c61675f76616c203d20656e635f666c61675b695d0a202020206374725f76616c203d20726563637572282869202a2069292b312925203235360a2020202076616c203d20666c61675f76616c205e206374725f76616c200a202020207072696e742820290a202020207072696e74286368722876616c292c656e643d222229202020875a6ff8d42f51b0
```

## Level 3
Decode it using CyberChef's From Hex we will get the following:
```py
def reccur(i):
     if(not i):
         return 1
     if(i == 1):
         return  3
     val_2 = 2 *reccur(i-1)
     return val_2 + 3* reccur(i-2)
     exit()
enc_flag = [102,75,163,239,156,158,7,143,92,120,0,54,183,65,199,253,60,182,204]
for i in range(20):
    flag_val = enc_flag[i]
    ctr_val = reccur((i * i)+1)% 256
    val = flag_val ^ ctr_val
    print( )
    print(chr(val),end="")   ZoøÔ/Q°
```

Cleaning up the code and execute we will only get `eBPF_w`, this is basically due the extensive recursive loops. Using GPT, we can implement Memoization to speed up the code:
```py
def reccur_memo(i, memo):
    if i in memo:
        return memo[i]

    if not i:
        return 1
    if i == 1:
        return 3

    val_2 = 2 * reccur_memo(i - 1, memo)
    result = val_2 + 3 * reccur_memo(i - 2, memo)
    memo[i] = result
    return result

memo = {}
enc_flag = [102,75,163,239,156,158,7,143,92,120,0,54,183,65,199,253,60,182,204]
for i in range(len(enc_flag)):
    flag_val = enc_flag[i]
    ctr_val = reccur_memo((i * i) + 1, memo) % 256
    val = (flag_val ^ ctr_val)
    print(chr(val),end="")
```

Running it we will get the flag:
```
bi0sctf{eBPF_wtF_1s_th4t???}
```
