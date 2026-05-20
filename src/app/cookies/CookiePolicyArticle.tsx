import Link from "next/link";

export function CookiePolicyArticle() {
  return (
    <article className="prose-cookie text-[15px] leading-relaxed text-[#262626] [&>p:nth-of-type(2)]:mt-0 [&_a]:break-words [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[#171717] [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-[#171717] [&_li]:mt-2 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mt-4 [&_strong]:font-semibold [&_table_a]:font-medium [&_table_a]:text-[var(--accent-primary)] [&_table_a]:underline [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
      <h1 className="text-4xl font-semibold tracking-tight text-[#171717] sm:text-5xl">Cookie 政策</h1>
      <p className="mt-2 mb-10 text-sm text-[var(--muted)]">最后更新日期：2025-04-09</p>

      <p>
        我公司使用 Cookie、像素和类似技术（在本 Cookie 政策中统称为「Cookie」）来帮助提供、保护和改进我公司的服务和网站。本 Cookie 政策适用于{" "}
        <strong>crowvpn.com</strong> 及由我公司运营的相关页面（以下合称「本网站」）。
      </p>
      <p>
        本 Cookie 政策是对我公司
        <Link
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[var(--accent-primary)] underline underline-offset-2 hover:text-[var(--accent-primary-hover)]"
        >
          《隐私政策》
        </Link>
        的补充，并介绍了 Cookie 的含义、我公司使用 Cookie 的方式和原因、我公司使用的 Cookie 类型以及您应如何管理自己的 Cookie 偏好。
      </p>
      <p>
        本 Cookie 政策中的大写词语的定义见本 Cookie 政策或我公司隐私政策和/或我公司
        <Link
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[var(--accent-primary)] underline underline-offset-2 hover:text-[var(--accent-primary-hover)]"
        >
          《服务条款》
        </Link>
        。
      </p>

      <h2>什么是 COOKIE？</h2>
      <p>
        在本 Cookie 政策中，我公司使用「Cookie」一词来统称 Cookie、像素、信标和相关技术。当您访问本网站时，此类小文本文件会悄无声息地植入您的设备（电脑、智能手机或任何其他设备）。其具有多种功能，例如，用于提高网站性能、衡量营销效果、为您的网络浏览器提供唯一标识，以及存储设置。此外，Cookie 还能确保重要信息的传输。
      </p>
      <p>
        您可以在各种独立信息网站上了解有关 Cookie 类型及其功能的更多信息，例如：{" "}
        <a href="https://knowcookies.com/" className="underline underline-offset-2" rel="noopener noreferrer">
          https://knowcookies.com/
        </a>{" "}
        或{" "}
        <a href="https://www.allaboutcookies.org/" className="underline underline-offset-2" rel="noopener noreferrer">
          https://www.allaboutcookies.org/
        </a>
        。
      </p>

      <h2>我公司使用 Cookie 的类型及原因是什么？</h2>
      <p>
        Cookie 有不同的分类方法。例如，可根据管理 Cookie 的公司（Cookie 来源）、Cookie 的有效期（Cookie 持续时间）或 Cookie 的用途进行分类。
      </p>
      <p>了解该等类别对于管理您对 Cookie 使用的偏好和提升您的用户体验非常重要。下面是本网站使用的 Cookie 类别的说明。</p>

      <h3>按照 Cookie 来源分类</h3>
      <p>
        <strong>第一方 Cookie：</strong>
        由我公司（即本网站）直接在用户设备上植入的 Cookie。
      </p>
      <p>
        <strong>第三方 Cookie：</strong>
        由集成在本网站的第三方服务（如分析或广告平台）在用户设备上植入的 Cookie。例如，如果您通过合作伙伴的链接访问本网站，或与本网站上的嵌入内容进行交互，特定的
        Cookie 会帮助收集有关此类交互的数据。这些数据是提升用户体验或提供合作伙伴特定优惠所必需的数据。
      </p>

      <h3>按照 Cookie 持续时间分类</h3>
      <p>
        <strong>会话 Cookie：</strong>
        在浏览器会话结束时失效的临时 Cookie；当用户关闭浏览器时，此类 Cookie 将被清除。
      </p>
      <p>
        <strong>持久性 Cookie：</strong>
        此类 Cookie 会在用户设备上保留一定的时间（从几天到几年不等），除非用户将其手动删除。您可以在本 Cookie 政策的「如何管理您的 Cookie 偏好？」一节中获取更多细节描述。
      </p>

      <h3>按照 Cookie 用途分类</h3>
      <ul>
        <li>必要（绝对必要）Cookie</li>
        <li>功能性 Cookie</li>
        <li>分析性 Cookie</li>
        <li>广告 Cookie</li>
      </ul>
      <p>我公司允许网站用户根据 Cookie 的用途对特定 Cookie 的使用表达自己的偏好。下面是对 Cookie 用途的详细说明。</p>

      <h3>必要（绝对必要）Cookie</h3>
      <p>
        此类 Cookie 对于维护本网站的基本功能不可或缺，因此无需用户明确同意即可在用户设备上植入。必要 Cookie 是提供我公司服务和确保本网站功能（包括记住您的
        Cookie 同意偏好的功能）和安全性所必需的 Cookie。通过此类 Cookie：
      </p>
      <ul>
        <li>您能够浏览本网站并使用其功能</li>
        <li>您能够获得并使用我公司服务</li>
        <li>我们可以检测并防止欺诈行为，提升本网站的信任度和安全措施</li>
      </ul>
      <p>
        例如，我公司会使用必要 Cookie 来保存您的 Cookie 偏好记录，并保护本网站和您的会话的安全（如 <code className="rounded bg-[#f3f4f6] px-1.5 py-0.5 text-[13px]">__cfruid</code>、
        <code className="rounded bg-[#f3f4f6] px-1.5 py-0.5 text-[13px]">cf_bm</code>{" "}
        等 Cookie）。其中一些 Cookie 由我公司的服务提供商（如 Cloudflare）创建。
      </p>

      <h3>功能性 Cookie</h3>
      <p>
        此类 Cookie 用于记住您在网站上输入的信息或做出的选择，这样您下次访问时便无需再次设置，从而增强用户体验。此类 Cookie 还能实现本网站的各项功能。
      </p>
      <p>请注意，如果您禁用功能性 Cookie，将无法访问本网站的某些功能。</p>
      <p>
        在考虑是否同意使用功能性 Cookie 时，请注意此类 Cookie 包括第三方 Cookie。您可以在本 Cookie 政策的「第三方服务提供商」一节查看我公司的第三方服务提供商列表。
      </p>

      <h3>分析性 Cookie</h3>
      <p>
        此类 Cookie 会收集有关您如何使用本网站的信息，例如，您最常访问的页面，以及您是否从这些页面收到错误消息。通过此类 Cookie，我公司可以改进我们的网站并分析其性能。此类
        Cookie 可为我公司提供汇总统计信息，如页面访问次数、页面加载速度以及用户在特定页面的停留时间。分析性 Cookie（如 Microsoft Clarity
        的分析性 Cookie）可帮助我公司了解用户与本网站和服务的交互方式，如点击、滚动和在页面上花费的时间，以便我公司改进功能和用户体验。数据以假名方式存储，不会用于识别个人身份。
      </p>
      <p>
        在考虑是否同意使用分析性 Cookie 时，此类 Cookie 包括第三方 Cookie。您可以在本 Cookie 政策的「第三方服务提供商」一节查看我公司的第三方服务提供商列表。
      </p>

      <h3>广告 Cookie</h3>
      <p>
        此类 Cookie 会记录您对本网站的访问情况、您访问过的其他页面以及您点击过的链接。此类 Cookie 由我公司或第三方广告平台或网络植入，旨在使本网站更能满足您的兴趣，投放广告并跟踪广告效果。我公司使用广告
        Cookie 的目的是：
      </p>
      <ul>
        <li>为您提供个性化广告（关于我公司的服务、在电子邮件中、在第三方网站等）</li>
        <li>显示更贴合您兴趣的内容，如广告</li>
        <li>评估和管理我公司的营销工作</li>
      </ul>
      <p>
        广告 Cookie 包括社交媒体 Cookie。通过此类 Cookie，您可以通过第三方社交网络和其他网站分享您在本网站上发现的有趣页面和内容。
      </p>
      <p>
        在考虑是否同意使用广告 Cookie 时，请注意此类 Cookie 包括第三方 Cookie。您可以在本 Cookie 政策的「第三方服务提供商」一节查看我公司的第三方服务提供商列表。
      </p>

      <h2>第三方服务提供商</h2>
      <p>
        我公司会使用第三方 Cookie，因为此类 Cookie 能以不同方式为我公司提供帮助。其中一些 Cookie 为必要 Cookie，而另一些 Cookie
        则有其他用途。例如，此类 Cookie 可帮助我公司实现负载平衡，抵御僵尸程序，并发现潜在的安全和性能问题。它们还能用于优化产品功能，深入了解产品使用情况，从而增强功能和整体用户体验，并评估和改进我公司的促销活动以及与您之间的通信。
      </p>
      <p>
        我公司使用的具体工具可能会因您访问的功能和/或您设备的操作系统而异。请注意，我公司聘用的第三方服务提供商可能会不时更换。下表列示我公司目前或可能使用的第三方服务提供商示例；实际以本网站集成为准，列表可能更新。
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
              <th className="px-4 py-3 font-semibold text-[#171717]">服务提供商</th>
              <th className="px-4 py-3 font-semibold text-[#171717]">用途</th>
              <th className="px-4 py-3 font-semibold text-[#171717]">隐私政策链接</th>
              <th className="px-4 py-3 font-semibold text-[#171717]">如何禁用 Cookie</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            <ProviderRow
              name="Amazon Web Services Inc."
              use="安全性"
              privacy="https://aws.amazon.com/privacy/"
              optOut="无法关闭"
            />
            <ProviderRow
              name="AppLovin Corporation"
              use="广告"
              privacy="https://legal.applovin.com/privacy/"
              optOut="AppLovin 退出页面"
            />
            <ProviderRow
              name="AppsFlyer Ltd."
              use="分析性、广告"
              privacy="https://www.appsflyer.com/legal/services-privacy-policy/"
              optOut="AppsFlyer 退出页面"
            />
            <ProviderRow
              name="Cloudflare Inc."
              use="安全性"
              privacy="https://www.cloudflare.com/privacypolicy/"
              optOut="无法关闭"
            />
            <ProviderRow
              name="Extreme Reach, Inc."
              use="广告"
              privacy="https://www.xr.global/legal/privacy-policy-for-xr-extreme-reach-ad-serving-and-analytics"
              optOut="请更改浏览器设置，禁用 Cookie。"
            />
            <ProviderRow
              name="Facebook (Meta Platforms)"
              use="分析性、广告"
              privacy="https://www.facebook.com/privacy/center/"
              optOut="Facebook 退出页面"
            />
            <ProviderRow
              name="Google Inc."
              use="分析性、广告、安全性"
              privacy="https://policies.google.com/privacy"
              optOut="Google Analytics 退出页面"
            />
            <ProviderRow
              name="Innovid Corp."
              use="广告"
              privacy="https://www.innovid.com/privacy-policy"
              optOut="Innovid 退出页面"
            />
            <ProviderRow
              name="LinkedIn"
              use="分析性、广告"
              privacy="https://www.linkedin.com/legal/privacy-policy"
              optOut="LinkedIn 退出页面"
            />
            <ProviderRow
              name="Microsoft"
              use="分析性、广告"
              privacy="https://privacy.microsoft.com/privacystatement"
              optOut="请更改浏览器设置，禁用 Cookie。"
            />
            <ProviderRow
              name="Reddit Inc."
              use="广告"
              privacy="https://www.reddit.com/policies/privacy-policy"
              optOut="请更改浏览器设置，禁用 Cookie。"
            />
            <ProviderRow
              name="Simpli.fi"
              use="广告"
              privacy="https://simpli.fi/services-privacy-policy"
              optOut="https://optout.simpli.fi/opt-out"
            />
            <ProviderRow
              name="Snapchat (Snap Inc.)"
              use="分析性、广告"
              privacy="https://values.snap.com/privacy/privacy-policy"
              optOut="请更改浏览器设置，禁用 Cookie。"
            />
            <ProviderRow
              name="TikTok Information Technologies"
              use="广告"
              privacy="https://www.tiktok.com/legal/page/eea/privacy-policy/en"
              optOut="请更改浏览器设置，禁用 Cookie。"
            />
            <ProviderRow
              name="Twitter (X Corp.)"
              use="分析性、广告"
              privacy="https://twitter.com/privacy"
              optOut="Twitter (X) 退出页面"
            />
            <ProviderRow
              name="Yahoo"
              use="分析性、广告"
              privacy="https://legal.yahoo.com/us/en/yahoo/privacy/index.html"
              optOut="Yahoo 退出页面"
            />
            <ProviderRow
              name="YouTube (Google Inc.)"
              use="广告"
              privacy="https://policies.google.com/privacy"
              optOut="Google Analytics 退出页面"
            />
          </tbody>
        </table>
      </div>

      <h2>如何管理您的 Cookie 偏好？</h2>

      <h3>网站 Cookie 控制</h3>
      <p>
        您可以随时修改或撤销非必要的 Cookie。若要查看或管理您的 Cookie 偏好，请参阅本网站页脚中的「Cookie 偏好」入口。
      </p>
      <p>
        如果您更改了同意状态，之前存储的 Cookie 可能会继续保留在您的浏览器中，但我公司不会从中获取任何信息。也可以通过浏览器设置删除此类 Cookie（如下所述）。
      </p>

      <h3>通过浏览器设置控制 Cookie</h3>
      <p>
        您可以控制在您的设备上植入哪些 Cookie。大多数类型的 Cookie 都可以通过浏览器设置予以禁用或删除。请注意，如果您将浏览器设置为拒绝接受
        Cookie，可能无法使用本网站的全部功能。以下链接提供了如何修改某些常用浏览器 Cookie 设置的信息：
      </p>
      <ul>
        <li>
          <a href="https://support.google.com/chrome/answer/95647" rel="noopener noreferrer" className="underline underline-offset-2">
            Google Chrome
          </a>
        </li>
        <li>
          <a href="https://support.apple.com/guide/safari/sfri11471/mac" rel="noopener noreferrer" className="underline underline-offset-2">
            Apple Safari
          </a>
        </li>
        <li>
          <a
            href="https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Microsoft Edge
          </a>
        </li>
        <li>
          <a
            href="https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Mozilla Firefox
          </a>
        </li>
        <li>
          <a href="https://help.opera.com/en/latest/web-preferences/" rel="noopener noreferrer" className="underline underline-offset-2">
            Opera
          </a>
        </li>
      </ul>

      <h3>移动设备 Cookie 控制</h3>
      <p>如果您使用的是 iPhone、iPad 或 Android 设备，可以控制是否显示基于兴趣的在线广告。操作方法如下。</p>
      <p>
        <strong>对于 iOS 设备（iPhone 和 iPad）：</strong>
      </p>
      <ol>
        <li>打开设备的「设置」。</li>
        <li>向下滚动并点击「隐私与安全性」（或「隐私」，视系统版本而定）。</li>
        <li>在隐私设置中，找到并选择「Apple 广告」或「广告」相关选项。</li>
        <li>启用「限制广告跟踪」或等效选项。</li>
      </ol>
      <p>您需要在所使用的每台 iOS 设备上分别选择退出，以确保您的偏好设置得到相应的应用。</p>
      <p>
        <strong>对于 Android 设备：</strong> 若要在 Android 设备上控制基于兴趣的广告，请按照{" "}
        <a href="https://support.google.com/ads/answer/2662922?hl=zh-Hans" rel="noopener noreferrer" className="underline underline-offset-2">
          Google 支持说明
        </a>{" "}
        操作。
      </p>
      <p>如果您使用多台 Android 设备，应在每台设备上分别选择退出，以便有效管理您的广告偏好。</p>

      <h3>其他 Cookie 控制方法</h3>
      <p>
        如果您想禁用广告 Cookie，请访问网络广告促进协会（Network Advertising Initiative）的退出页面、数字广告联盟（Digital Advertising
        Alliance）的退出页面或{" "}
        <a href="http://youronlinechoices.eu/" rel="noopener noreferrer" className="underline underline-offset-2">
          http://youronlinechoices.eu
        </a>{" "}
        了解详细内容。若要退出推送广告的 Google Analytics 或自定义 Google 展示网络广告，请访问 Google 广告设置页面。
      </p>
      <p>
        请注意，如果您禁用所有 Cookie，本网站可能无法正常运行或根本无法运行，您对本网站及其功能的访问可能也会受到影响或限制。
      </p>

      <h2>禁止跟踪信号和类似机制</h2>
      <p>
        「禁止跟踪」（DNT）是网络用户可以在某些网络浏览器中设置的一种隐私偏好。我公司致力于为您提供有意义的选择，让您通过 Cookie
        和类似技术收集到的信息了解我公司的服务，这也是我公司提供上述各种退出机制的原因。但是，我公司目前无法识别或响应浏览器发出的 DNT 信号。
      </p>
    </article>
  );
}

function ProviderRow({
  name,
  use,
  privacy,
  optOut,
}: {
  name: string;
  use: string;
  privacy: string;
  optOut: string;
}) {
  const isHttp = optOut.startsWith("http");
  return (
    <tr>
      <td className="px-4 py-3 align-top text-[#171717]">{name}</td>
      <td className="px-4 py-3 align-top text-[var(--muted)]">{use}</td>
      <td className="px-4 py-3 align-top">
        <a href={privacy} rel="noopener noreferrer" target="_blank">
          {privacy}
        </a>
      </td>
      <td className="px-4 py-3 align-top text-[var(--muted)]">
        {isHttp ? (
          <a href={optOut} rel="noopener noreferrer" target="_blank" className="font-medium text-[var(--accent-primary)] underline">
            {optOut}
          </a>
        ) : (
          optOut
        )}
      </td>
    </tr>
  );
}
