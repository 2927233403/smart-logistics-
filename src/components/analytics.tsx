"use client"

import Script from "next/script"

// Google Analytics 配置
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ""

// 百度统计配置
const BAIDU_TRACKING_ID = process.env.NEXT_PUBLIC_BAIDU_ID || ""

export function GoogleAnalytics() {
  if (!GA_TRACKING_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}');
        `}
      </Script>
    </>
  )
}

export function BaiduAnalytics() {
  if (!BAIDU_TRACKING_ID) return null

  return (
    <Script id="baidu-analytics" strategy="afterInteractive">
      {`
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?${BAIDU_TRACKING_ID}";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();
      `}
    </Script>
  )
}
