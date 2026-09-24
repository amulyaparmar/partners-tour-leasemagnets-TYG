import type { Metadata } from "next";

import PilotGallery from "./pilot-gallery";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Tour.report Marketing AI & Roboadvisor",
  description:
    "A four-page introduction to Tour.report, the marketing visibility platform now running in private multifamily pilots.",
};

const channels = ["Instagram", "TikTok", "Google Ads", "Meta Ads"];
const monitoringSignals = [
  { number: "01", title: "Ads intelligence & paid listings check", detail: "YouTube, Google, Meta + listing spend checks" },
  { number: "02", title: "Social presence / intelligence", detail: "Instagram and TikTok publishing" },
  { number: "03", title: "GEO / AI discovery", detail: "Visibility in AI-driven discovery" },
  { number: "04", title: "Reviews", detail: "Public ratings and reputation signals" },
  { number: "05", title: "Estimated web traffic", detail: "Directional website activity" },
  { number: "06", title: "SEO visibility", detail: "Organic search presence" },
];
function Brand() {
  return (
    <span className={styles.brand}>
      <span className={styles.brandMark} aria-hidden="true" />
      Tour.report
    </span>
  );
}

export default function TourReportMarketingVisibilityPage() {
  return (
    <main className={styles.shell}>
      <div className={styles.deck}>
        <section
          className={`${styles.slide} ${styles.firstSlide}`}
          id="market-visibility"
          aria-labelledby="tour-report-title"
        >
          <header className={styles.runhead}>
            <Brand />
            <span>Knowledgebase / Marketing visibility</span>
          </header>

          <div className={styles.firstGrid}>
            <div className={styles.firstCopy}>
              <p className={styles.eyebrow}>01 / The platform</p>
              <h1 id="tour-report-title" className={styles.heroTitle}>
                Tour.report
                <br />
                <span>Marketing AI</span>
                <br />
                &amp; Roboadvisor.
              </h1>
              <p className={styles.heroLead}>
                See the marketing your market sees - across your properties and
                the competitors around them.
              </p>

              <div className={styles.insight}>
                <p className={styles.eyebrow}>02 / The blind spot</p>
                <h2>Pricing has comps. Marketing should, too.</h2>
                <p>
                  Operators rarely have one clear view of the ads running in
                  their market, or a way to compare the quality of their own
                  spend with competing properties. We already benchmark rents
                  against comps. Tour.report brings that same perspective to
                  marketing.
                </p>
              </div>
            </div>

            <div className={styles.marketStage}>
              <div className={styles.stageGlow} aria-hidden="true" />
              <div className={styles.marketWindow}>
                <div className={styles.windowTop}>
                  <span className={styles.windowBrand}>
                    <span className={styles.miniMark} aria-hidden="true" />
                    tour.report
                  </span>
                  <span>Illustrative market view</span>
                </div>
                <div className={styles.windowIntro}>
                  <span>MARKET LENS</span>
                  <strong>Your property + selected comps</strong>
                  <p>Campaign activity, creative formats, and channel presence.</p>
                </div>
                <div className={styles.channelLine}>
                  {channels.map((channel) => (
                    <span key={channel}>{channel}</span>
                  ))}
                </div>
                <div className={styles.compareGrid}>
                  <div className={styles.compareCard}>
                    <span>YOUR PROPERTY</span>
                    <strong>What you are publishing</strong>
                    <div className={styles.signalBar}>
                      <i />
                      <i />
                      <i />
                    </div>
                    <small>Posts / active ads / creative mix</small>
                  </div>
                  <div className={styles.compareCard}>
                    <span>YOUR COMP SET</span>
                    <strong>What is live nearby</strong>
                    <div className={styles.signalBar}>
                      <i />
                      <i />
                      <i />
                    </div>
                    <small>Comparable in-market signals</small>
                  </div>
                </div>
                <div className={styles.advisorLine}>
                  <span>ROBOADVISOR</span>
                  <strong>One view of your marketing in market context.</strong>
                </div>
              </div>
              <div className={styles.floatingLabel}>From blind spot to benchmark.</div>
            </div>
          </div>

          <footer className={styles.footer}>
            <span>Tour.report / Field notes</span>
            <a href="#built-in-2025">How it started <span aria-hidden="true">↗</span></a>
            <span>01 / 04</span>
          </footer>
        </section>

        <section
          className={`${styles.slide} ${styles.secondSlide}`}
          id="built-in-2025"
          aria-labelledby="origin-title"
        >
          <header className={styles.runhead}>
            <Brand />
            <span>From internal tracking to market intelligence</span>
          </header>

          <div className={styles.secondHeading}>
            <p className={styles.eyebrow}>03 / How it started</p>
            <h2 id="origin-title">
              Built for our own tours.
              <br />
              Opened to the whole market.
            </h2>
          </div>

          <div className={styles.secondGrid}>
            <div className={styles.originColumn}>
              <div className={styles.storyStep}>
                <span>2025 / INTERNAL VIEW</span>
                <h3>First, we tracked how video moved.</h3>
                <p>
                  We built video-marketing technology and wanted to understand
                  how partner properties reused their tours as ad sets and social
                  posts.
                </p>
              </div>
              <div className={styles.storyStep}>
                <span>2025 / PARTNER QUESTION</span>
                <h3>Then partners asked about the comps.</h3>
                <p>
                  One partner asked us to track competing properties. Others
                  asked whether the same visibility could be delivered through
                  an API.
                </p>
              </div>
            </div>

            <div className={styles.platformColumn}>
              <p className={styles.eyebrow}>04 / The visibility layer</p>
              <h3>Load a property set. Add its comps.</h3>
              <p>
                Marketing agents index partner Instagram and TikTok posts,
                alongside Google Ads and Meta Ads. Tour.report brings those
                signals together so operators can see what is running and assess
                their marketing in competitive context.
              </p>
              <div className={styles.sourceGrid} aria-label="Marketing sources">
                {channels.map((channel) => (
                  <span key={channel}>{channel}</span>
                ))}
              </div>
              <div className={styles.apiLine}>
                <span>Any property set</span>
                <span aria-hidden="true">→</span>
                <span>Its comps</span>
                <span aria-hidden="true">→</span>
                <strong>Tour.report API</strong>
              </div>
            </div>
          </div>

          <footer className={styles.footer}>
            <span>Tour.report / Marketing AI &amp; Roboadvisor</span>
            <a href="#monitoring-ecosystem">Explore the monitoring layer <span aria-hidden="true">↗</span></a>
            <span>02 / 04</span>
          </footer>
        </section>

        <section
          className={`${styles.slide} ${styles.thirdSlide}`}
          id="monitoring-ecosystem"
          aria-labelledby="ecosystem-title"
        >
          <header className={styles.runhead}>
            <Brand />
            <span>Beyond ads / the full digital footprint</span>
          </header>

          <div className={styles.ecosystemGrid}>
            <div className={styles.ecosystemCopy}>
              <p className={styles.eyebrow}>05 / The monitoring ecosystem</p>
              <h2 id="ecosystem-title">
                We widened the lens
                <br />
                <span>beyond ads.</span>
              </h2>
              <p className={styles.ecosystemLead}>
                We layered ads and paid-listing intelligence, social presence,
                GEO, reviews, estimated website traffic, and SEO into the same
                market view. Now each property can sit beside its comps.
              </p>
              <div className={styles.ecosystemAside}>
                <span>THE IDEA</span>
                <strong>
                  Don&apos;t just ask which ads are live. See how the property
                  shows up across the market.
                </strong>
              </div>
            </div>

            <div className={styles.signalBoard}>
              <div className={styles.signalBoardTop}>
                <div>
                  <span>TOUR.REPORT / SIGNAL LAYER</span>
                  <strong>One view. More context.</strong>
                </div>
                <span className={styles.compPill}>PROPERTY + COMPS</span>
              </div>
              <ol className={styles.signalCards}>
                {monitoringSignals.map((signal) => (
                  <li key={signal.number}>
                    <span>{signal.number} / SIGNAL</span>
                    <strong>{signal.title}</strong>
                    <p>{signal.detail}</p>
                  </li>
                ))}
              </ol>
              <div className={styles.signalBoardBottom}>
                <span>PAID LISTING CHECKS</span>
                <strong>Apartments.com</strong>
                <strong>Zillow</strong>
                <strong>ApartmentList.com</strong>
                <strong>Rent College Pads</strong>
              </div>
            </div>
          </div>

          <footer className={styles.footer}>
            <span>Tour.report / Marketing AI &amp; Roboadvisor</span>
            <a href="#private-pilots">See the pilot workspace <span aria-hidden="true">↗</span></a>
            <span>03 / 04</span>
          </footer>
        </section>

        <section
          className={`${styles.slide} ${styles.fourthSlide}`}
          id="private-pilots"
          aria-labelledby="pilots-title"
        >
          <header className={styles.runhead}>
            <Brand />
            <span>Private multifamily pilots / product views</span>
          </header>

          <div className={styles.pilotGrid}>
            <div className={styles.pilotCopy}>
              <p className={styles.eyebrow}>06 / In the field</p>
              <h2 id="pilots-title">
                Now running in
                <br />
                <span>private multifamily pilots.</span>
              </h2>
              <p className={styles.pilotLead}>
                Tour.report brings the property and its comps into one working
                view. Pilot teams can move between estimated traffic, review
                momentum, SEO and GEO search visibility, and live ad activity.
              </p>
              <div className={styles.pilotStatus}>
                <span className={styles.statusDot} aria-hidden="true" />
                PRIVATE PILOT / MULTIFAMILY
              </div>
              <p className={styles.pilotNote}>
                Choose a workspace view below, then click the large image to
                inspect it without leaving this page.
              </p>
            </div>

            <PilotGallery />
          </div>

          <footer className={styles.footer}>
            <span>Tour.report / Marketing AI &amp; Roboadvisor</span>
            <a href="#market-visibility">Back to the overview <span aria-hidden="true">↗</span></a>
            <span>04 / 04</span>
          </footer>
        </section>
      </div>
    </main>
  );
}
