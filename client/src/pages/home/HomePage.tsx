import WaButton from "@awesome.me/webawesome/dist/react/button/index.js";
import WaButtonGroup from "@awesome.me/webawesome/dist/react/button-group/index.js";
import { DragonScrollMark } from "../../components/dragon-scroll-mark/DragonScrollMark";
import { SiteFooter } from "../../components/site-footer/SiteFooter";
import { SiteHeader } from "../../components/site-header/SiteHeader";

const workItems = [
  {
    title: "SimpleETL",
    href: "https://simpleetl.bonecutters.us/",
    description: [
      "SimpleETL is an independent software project focused on making structured data movement and transformation easier to work through.",
      "The project is early-stage, but it reflects the kind of system I like to build: practical, understandable, and oriented around the work people actually need to do.",
      "It is also a useful public example of how I organize product thinking, implementation, documentation, and validation around a software project.",
    ],
  },
  {
    title: "CatapultCMS",
    href: "https://www.catapultcms.com/",
    description: [
      "CatapultCMS has been a long-running part of my professional life, especially around public-sector and education-focused web platforms.",
      "My work there has included software development, platform operations, customer support, release processes, infrastructure planning, and helping teams keep complex systems understandable.",
      "It is the kind of work where reliability matters, communication matters, and small improvements can have a real effect on the people who depend on the system every day.",
    ],
  },
  {
    title: "Idea Fab Labs",
    href: "https://chico.ideafablabs.com/",
    description: [
      "Idea Fab Labs is a community makerspace where technology, education, and practical experimentation overlap.",
      "My involvement there has connected software work with physical tools, community learning, and the kinds of projects that only happen when people have space to build together.",
    ],
  },
];

export function HomePage() {
  return (
    <main className="home-page">
      <SiteHeader />
      <DragonScrollMark finishSectionId="name" />
      <section className="home-page__hero" aria-labelledby="home-title">
        <div className="home-page__copy">
          <h1 id="home-title">Jediah Blankenship</h1>
          <p className="home-page__dek">Technology leader, software builder, and practical systems thinker.</p>
          <p className="home-page__lede">
            I've spent the last 15 years building, improving, and supporting software
            platforms for education, public-sector, and community-focused organizations. My
            work usually lives in the space between people, process, and software: helping
            teams understand complicated problems, build better tools, and keep important
            systems running.
          </p>
          <p className="home-page__lede">
            Bonecutters is my long-running personal domain. These days, it is the home base for
            my email, independent software projects, and the bits of professional context that
            do not fit neatly on a resume.
          </p>
          <WaButtonGroup className="home-page__actions" aria-label="Primary links">
            <WaButton href="https://www.linkedin.com/in/jediah-blankenship/" target="_blank" rel="noreferrer">
              LinkedIn
            </WaButton>
            <WaButton href="https://github.com/bonecutter-hierophant" target="_blank" rel="noreferrer">
              GitHub
            </WaButton>
            <WaButton href="https://simpleetl.bonecutters.us/" target="_blank" rel="noreferrer">
              SimpleETL
            </WaButton>
            <WaButton href="mailto:jediah@bonecutters.us">Email</WaButton>
          </WaButtonGroup>
        </div>
      </section>

      <section className="home-page__section" id="about" aria-labelledby="about-title">
        <div className="home-page__section-copy">
          <p className="home-page__eyebrow">About</p>
          <h2 id="about-title">I tend to be most useful when a problem has a lot of moving parts.</h2>
          <p>
            That has meant different things at different points in my career: building websites,
            leading software teams, managing cloud infrastructure, improving release processes,
            reducing operational costs, supporting customer-facing systems, and helping
            organizations make better use of the technology they already have.
          </p>
          <p>
            I'm not especially interested in technology for its own sake. I'm interested in what
            happens when the right tool makes a hard job easier, a process clearer, or a team
            more capable. Good systems should reduce confusion, support good decisions, and make
            people's work feel a little less fragile.
          </p>
          <p>
            My background is technical, but much of my work has been about communication:
            translating between users, developers, executives, vendors, and support teams so
            that the right problems get solved in the right order.
          </p>
        </div>
      </section>

      <section className="home-page__section home-page__section--work" id="work" aria-labelledby="work-title">
        <div className="home-page__section-copy">
          <p className="home-page__eyebrow">Selected Work</p>
          <h2 id="work-title">Projects and platforms</h2>
          <div className="home-page__work-list">
            {workItems.map((item) => (
              <article className="home-page__work-item" key={item.href}>
                <h3>{item.title}</h3>
                <div>
                  {item.description.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  <a className="home-page__text-link" href={item.href} target="_blank" rel="noreferrer">
                    Visit {item.title}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-page__section" id="writing" aria-labelledby="writing-title">
        <div className="home-page__section-copy">
          <p className="home-page__eyebrow">Writing</p>
          <h2 id="writing-title">Tron, Tokens, and the Grid</h2>
          <p>Occasionally I write longer notes when I'm trying to explain a technical idea in plain language.</p>
          <p>
            This piece uses Tron as a metaphor for understanding large language models, tokens,
            hallucinations, guardrails, memory, and why AI systems are better understood as
            pattern-based tools than virtual brains.
          </p>
          <a
            className="home-page__text-link"
            href="https://www.linkedin.com/pulse/tron-tokens-grid-why-ai-isnt-virtual-brain-its-jediah-blankenship-iivuc/"
            target="_blank"
            rel="noreferrer"
          >
            Read on LinkedIn
          </a>
          <h2 className="home-page__writing-title">README.md - Where Am I?</h2>
          <p>
            This piece uses an amnesiac RPG hero as a metaphor for coding agents entering
            unfamiliar projects, and explores how branches, proposals, documentation, workflows,
            and tests provide the layered context they need to navigate and work effectively.
          </p>
          <a
            className="home-page__text-link"
            href="https://www.linkedin.com/pulse/readmemd-where-am-i-jediah-blankenship-skswc/"
            target="_blank"
            rel="noreferrer"
          >
            Read on LinkedIn
          </a>
        </div>
      </section>

      <section className="home-page__section" id="name" aria-labelledby="name-title">
        <div className="home-page__section-copy">
          <p className="home-page__eyebrow">About the Name</p>
          <h2 id="name-title">Bonecutters is a name with a story.</h2>
          <p>
            It started as an inside joke from a long-running game night and gradually became the
            domain I used for personal projects, professional tools, and independent software
            experiments. It is not a formal company, and it is not trying to be more mysterious
            than it is.
          </p>
          <p>
            These days, Bonecutters is mostly a home base: a place for the work, ideas, and
            projects that do not fit cleanly into a resume, job title, or LinkedIn profile.
          </p>
          <p>The name is a little odd. That part is true. But it has been around long enough that it feels honest to keep it.</p>
        </div>
      </section>

      <section className="home-page__section home-page__section--contact" id="contact" aria-labelledby="contact-title">
        <div className="home-page__section-copy">
          <p className="home-page__eyebrow">Contact</p>
          <h2 id="contact-title">The easiest way to reach me is by email.</h2>
          <WaButton className="home-page__contact-button" href="mailto:jediah@bonecutters.us">
            jediah@bonecutters.us
          </WaButton>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
