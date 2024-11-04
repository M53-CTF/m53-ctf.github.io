---
title: "[VISHWACTF] Ethereal Crackme"
date: "9 April 2023"
toc: false
images:
author: "Tzion"
origsrc: "https://tzion0.github.io/posts/vishwactf2023-etherealcrackme/"
category: "REV"
tags:
  - VISHWACTF
  - REV
  - 2023
---

This challenge provided a two windows executable files called `HauntedImage.exe` and `HauntedCursor.exe`.

Please note that I did not solve this challenge during the competition, only solved it after the competition without completely understanding the challenge.

## HauntedImage.exe Analysis
Looking at the binary we noticed that it was huge and looks unlikely to be reverse within 1-2 days (atleast for me). Therefore we chose to execute the binary directly, and it will generate a corrupted image called `result.jpg`. Looking at `result.jpg` in Hex Editor tell us that it was not related to a valid image at all. One hint provided by organizer: "The image is not corrupted" indirectly tell us that we should try out few things. What we did is we simply execute the `HauntedImage.exe` again, but this time specifying the `result.jpg` as argument. And the `result.jpg` will changed to a valid picture with an URL in it like following:

![IMG](/images/ctfs/vishwactf2023-etherealcrackme/1.png)

The URL will lead us to download a Cursor Image file. And that's the information I managed to get during the CTF for this binary. Only after the CTF I found out that running the binary again with the cursor image file will generate the Ouija Board image, which will be useful but not necessary for us.

## HauntedCursor.exe Analysis
TLDR: This binary is in charge for pointing our cursor to the correct position based on the Ouija Board.

The first part of the binary is basically finding for a window called `MSPaintApp`. That means that in order to exit out of this loop, we have to open MSPaintApp.
```C
do
{
    lpWideCharStr = L"MSPaintApp";
    cbMultiByte = WideCharToMultiByte(0xFDE9u, 0, L"MSPaintApp", -1, 0i64, 0, 0i64, 0i64);
    lpMultiByteStr = (LPSTR)operator new[](cbMultiByte);
    WideCharToMultiByte(0xFDE9u, 0, lpWideCharStr, -1, lpMultiByteStr, cbMultiByte, 0i64, 0i64);
}
while ( !FindWindowA(lpMultiByteStr, 0i64) );
```

The following part of the binary in main function will render the string `"I NEED TO TALK TO YOU BUT I CAN DO IT ONLY THROUGH THE OUIJA BOARD.....\nPress enter to go to the next step.."` on the screen and wait for our Enter key input to proceed. After that, the program will check for number of arguments we provided, convert the argument to integer and pass to function `checkSecondStep(v18);`:
```C
Gdiplus::GdiplusStartupInput::GdiplusStartupInput((Gdiplus::GdiplusStartupInput *)v15, 0i64, 0, 0);
GdiplusStartup(v14, v15, 0i64);
DC = GetDC(0i64);
Gdiplus::Graphics::Graphics((Gdiplus::Graphics *)v13, DC);
Gdiplus::FontFamily::FontFamily(v12, L"Times New Roman", 0i64);
Gdiplus::Font::Font((unsigned int)v11, (unsigned int)v12, v3, 16, 2);
Gdiplus::PointF::PointF((Gdiplus::PointF *)v10, 500.0, 500.0);
Gdiplus::Color::Color((Gdiplus::Color *)v16, 0xFFu, 0, 0, 0xFFu);
Gdiplus::SolidBrush::SolidBrush((Gdiplus::SolidBrush *)v9, (const Gdiplus::Color *)v16);
Gdiplus::Graphics::DrawString(
    (Gdiplus::Graphics *)v13,
    L"I NEED TO TALK TO YOU BUT I CAN DO IT ONLY THROUGH THE OUIJA BOARD.....\nPress enter to go to the next step..",
    -1,
    (const Gdiplus::Font *)v11,
    (const Gdiplus::PointF *)v10,
    (const Gdiplus::Brush *)v9);
if ( GetAsyncKeyState(13) < 0 || v24 )
{
    v24 = 1;
    _IAT_start__(DC);
    if ( argc == 2 )
    {
    std::allocator<char>::allocator(&v17);
    std::__cxx11::basic_string<char,std::char_traits<char>,std::allocator<char>>::basic_string(v8, argv[1], &v17);
    std::allocator<char>::~allocator(&v17);
    v5 = (const char *)std::__cxx11::basic_string<char,std::char_traits<char>,std::allocator<char>>::c_str(v8);
    v18 = atoi(v5);
    checkSecondStep(v18);
    std::__cxx11::basic_string<char,std::char_traits<char>,std::allocator<char>>::~basic_string(v8);
    }
    else
    {
    checkSecondStep(1);
    }
    v6 = 0;
}
else
{
    v6 = 1;
}
```

Looking into `checkSecondStep` function, it basically executing the `movePointer` function in while loop:
```C
__int64 __fastcall checkSecondStep(int a1)
{
  while ( !(unsigned int)movePointer(a1) );
  return 0i64;
}
```

Looking into `movePointer` function, it basically go through some Desktop Window checking, extract pixel from it, do some comparison and lastly set the cursor pointer position to the flag characters:
```C
__int64 __fastcall movePointer(int a1)
{
  struct tagPOINT Point; // [rsp+24h] [rbp-4Ch] BYREF
  LONG y; // [rsp+2Ch] [rbp-44h]
  LONG x; // [rsp+30h] [rbp-40h]
  int v5; // [rsp+34h] [rbp-3Ch]
  int v6; // [rsp+38h] [rbp-38h]
  int v7; // [rsp+3Ch] [rbp-34h]
  int v8; // [rsp+40h] [rbp-30h]
  COLORREF v9; // [rsp+44h] [rbp-2Ch]
  HDC hDC; // [rsp+48h] [rbp-28h]
  HWND DesktopWindow; // [rsp+50h] [rbp-20h]
  COLORREF Pixel; // [rsp+5Ch] [rbp-14h]
  HDC hdc; // [rsp+60h] [rbp-10h]
  HWND hWnd; // [rsp+68h] [rbp-8h]

  hWnd = GetDesktopWindow();
  hdc = GetDC(hWnd);
  Pixel = GetPixel(hdc, 0, 0);
  ReleaseDC(hWnd, hdc);
  if ( (_BYTE)Pixel == 38 && *(_WORD *)((char *)&Pixel + 1) == 10302 )
  {
    DesktopWindow = GetDesktopWindow();
    hDC = GetDC(DesktopWindow);
    v9 = GetPixel(hDC, 0, 1);
    v8 = (unsigned __int8)v9;
    v7 = BYTE1(v9);
    v6 = BYTE2(v9);
    ReleaseDC(DesktopWindow, hDC);
    if ( (_BYTE)v9 == 62 && *(_WORD *)((char *)&v9 + 1) == 11592 )
    {
      v5 = 645;
      if ( a1 % 645 )
      {
        while ( 1 )
          SetCursorPos(9999, 200);
      }
      SetCursorPos(10000, 10000);
      GetCursorPos(&Point);
      x = Point.x;
      y = Point.y;
      do
      {
        SetCursorPos((int)(float)(0.25416666 * (float)x), (int)(float)(0.56388891 * (float)y));
        Sleep(0x320u);
        SetCursorPos((int)(float)(0.75312501 * (float)x), (int)(float)(0.74537039 * (float)y));
        Sleep(0x320u);
        SetCursorPos((int)(float)(0.78489584 * (float)x), (int)(float)(0.44074073 * (float)y));
        Sleep(0x320u);
        SetCursorPos((int)(float)(0.48645833 * (float)x), (int)(float)(0.49166667 * (float)y));
        Sleep(0x320u);
        SetCursorPos((int)(float)(0.34791666 * (float)x), (int)(float)(0.72314817 * (float)y));
        Sleep(0x320u);
        SetCursorPos((int)(float)(0.36458334 * (float)x), (int)(float)(0.51851851 * (float)y));
        Sleep(0x320u);
        SetCursorPos((int)(float)(0.48958334 * (float)x), (int)(float)(0.3425926 * (float)y));
        Sleep(0x320u);
        SetCursorPos((int)(float)(0.34218749 * (float)x), (int)(float)(0.74722224 * (float)y));
        Sleep(0x320u);
        SetCursorPos((int)(float)(0.61406249 * (float)x), (int)(float)(0.36851853 * (float)y));
        Sleep(0x320u);
        SetCursorPos((int)(float)(0.45885417 * (float)x), (int)(float)(0.73703706 * (float)y));
        Sleep(0x320u);
        SetCursorPos((int)(float)(0.48802084 * (float)x), (int)(float)(0.50185186 * (float)y));
        Sleep(0x320u);
        SetCursorPos((int)(float)(0.24947916 * (float)x), (int)(float)(0.55740738 * (float)y));
        Sleep(0x320u);
        SetCursorPos((int)(float)(0.74635416 * (float)x), (int)(float)(0.74166667 * (float)y));
        Sleep(0x320u);
        SetCursorPos((int)(float)(0.61354166 * (float)x), (int)(float)(0.34722221 * (float)y));
        Sleep(0x320u);
        SetCursorPos((int)(float)(0.15364583 * (float)x), (int)(float)(0.66018516 * (float)y));
        Sleep(0x320u);
        SetCursorPos((int)(float)(0.48333332 * (float)x), (int)(float)(0.49907407 * (float)y));
        Sleep(0x320u);
        SetCursorPos((int)(float)(0.34583333 * (float)x), (int)(float)(0.74722224 * (float)y));
        Sleep(0x320u);
        SetCursorPos((int)(float)(0.37291667 * (float)x), (int)(float)(0.52407408 * (float)y));
        Sleep(0x320u);
      }
      while ( GetAsyncKeyState(13) >= 0 );
      return 1i64;
    }
    else
    {
      return 0i64;
    }
  }
  else
  {
    std::operator<<<std::char_traits<char>>(refptr__ZSt4cout, "Use the ouija board\n");
    Sleep(0x12Cu);
    return 0i64;
  }
}
```

Honestly, I wasn't able to fulfill the conditions of Desktop Window it required to pass the check, therefore we will use debugger to bypass it by setting the RIP to the location where it start moving cursor. Moreover, the `a1`, which is the argument we have to provide will be use for a check eventually:
```C
v5 = 645;
if ( a1 % 645 )
{
    while ( 1 ) SetCursorPos(9999, 200);
}
```

With all the informations we obtained, we can start solving the challenge. First, open MSPaintApp and leave it aside. Next, open `HauntedCursor.exe` in your favourite debugger, set argument as `645` and set a breakpoint at `40155B` and run the program. Once you reached the breakpoint, change the RIP to `401673`:

![IMG](/images/ctfs/vishwactf2023-etherealcrackme/2.png)

Before we run the program, we have to change our desktop wallpaper to the Ouija Board image we obtained earlier. imagine that if we wasn't able to obtain the Ouija Board earlier, we can simply download one from internet, it will work as well. Also, if you want to have more clearer cursor, you can change your cursor with the cursor image you obtained earlier.

With everything set, run the program and the cursor will point to the flag character by character!

### Flag:
```md
VishwaCTF{P0LT3RG3I5TP0INT3R}
```
