---
title: "[BSIDESTLVCTF] Tsebrakhn"
date: "29 June 2023"
toc: false
images:
author: "Tzion"
origsrc: "https://tzion0.github.io/posts/bsidestlvctf2023-tsebrakhn/"
category: "REV"
tags:
  - BSIDESTLVCTF
  - REV
  - 2023
---

This challenge provided a binary file and a netcat instance.

Please note that I did not solve this challenge during the competition; instead, I only managed to understand the flow after the CTF by analyzing the correct passcode provided in Slack.

The correct passcode: `AAAAAAAAAAAAAAAAAAAAAAAAAAAAA!se`

Running the binary prompts us for a passcode, making it clear that we need the correct passcode to obtain the flag.

When loading the binary in IDA, IDA failed to analyze it well, so pressing F5 for decompilation was not possible.

![IMG](/images/ctfs/bsidestlvctf2023-tsebrakhn/img1.jpg)

Unfortunately, I am not familiar with the proper way to fix this issue. Therefore, I took an alternative approach, performing cross-checking with dynamic analysis and static analysis to figure out the program flow.

### Program Flow
1. First, the program prompts us for the passcode and checks the input length. The length must be <= 32 to proceed with the execution. If the length exceeds this limit, the program prints out `Buffer overflow detected!...` and terminates.

2. Next, it displays the message `Checking passcode! [Under construction]` and compares our input length with the value 0x59657321. If the check passes, it appends `Welldone! Your passcode is indeed:` to our input. Otherwise, it appends `You shall not pass! Your entry was:`. Interestingly, this behavior is intended to confuse the player, as the latter string was the intended output. It is highly unlikely for our input length to equal 0x59657321.

3. The program then calculates the length of the appended string and the input string being appended. It continues appending our appended input string with itself at `loc_15A1` until a specific condition is met:
   ```asm
   mov     eax, [rbp-4]
   cmp     eax, [rbp-10h]
   jl      short loc_15A1
   ```
   ![IMG](/images/ctfs/bsidestlvctf2023-tsebrakhn/img2.png)

4. However, the block of code at `loc_15A1` appears straightforward until we take a closer look at the memory. The **yellow arrow** points to the byte (0x43) at `[rbp-10h]`, while the **red arrow** points to the area that will eventually be filled. Surprisingly, it overwrites the value 0x43 with 0x20. This behavior occurs only when our passcode input length is exactly 32:

    ![IMG](/images/ctfs/bsidestlvctf2023-tsebrakhn/img3.png)
    ![IMG](/images/ctfs/bsidestlvctf2023-tsebrakhn/img4.png)

5. Eventually, the program reaches a point where it compares our input length again with 0x59657321. However, due to the overwritten memory and correct alignment, it obtains the DWORD PTR of `Yes!` instead, which is equivalent to 0x59657321 in hex. Once this check is passed, we will receive the flag.

    ![IMG](/images/ctfs/bsidestlvctf2023-tsebrakhn/img5.png)


### Flag:
```
BSidesTLV2023{Iz_deyn_tsatske_tsebrakhn?}
```