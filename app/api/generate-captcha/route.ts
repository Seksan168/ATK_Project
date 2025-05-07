// import { NextResponse } from 'next/server';
// import svgCaptcha from 'svg-captcha';

// export async function GET(request: Request) {
//   try {
//     // Generate CAPTCHA
//     const captcha = svgCaptcha.create({
//       size: 4, // 4 characters
//       ignoreChars: '0o1i', // Ignore characters that can be confusing (like '0' and 'O')
//       noise: 3, // Add some noise to the image
//       color: true, // Color the captcha text
//       background: '#f0f0f0', // Set the background color
//     });

//     // Store the CAPTCHA text in a cookie or a session for comparison later
//     const captchaText = captcha.text;

//     // For simplicity, we'll set the CAPTCHA text as a cookie for the client to use
//     const headers = new Headers();
//     headers.set('Set-Cookie', `captchaText=${captchaText}; HttpOnly; Path=/register`);

//     // Return the CAPTCHA image as SVG
//     return NextResponse.json({ captcha: captcha.data }, { status: 200, headers });
//   } catch (error) {
//     console.error('Error generating CAPTCHA:', error);
//     return NextResponse.json({ error: 'Failed to generate CAPTCHA' }, { status: 500 });
//   }
// }
