import "./about.css";

export default function About() {
  return (
    <div className="about">
      <div className="aboutContent">
        <h1>About Zenticle</h1>
        <p>
          Welcome to <strong>Zenticle</strong> — a platform where ideas, stories, and inspiration come to life.
          Whether you're here to share your thoughts, discover new perspectives, or simply read something inspiring,
          this is your place.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our goal is to create a peaceful and powerful blogging experience for everyone.
          Zenticle values clarity, creativity, and inclusiveness — whether you're a seasoned writer or a curious beginner.
        </p>

        <h2>What You Can Do</h2>
        <ul>
          <li>📝 Create and publish your own thoughtful blog posts</li>
          <li>📚 Explore engaging blogs written by others</li>
          <li>💬 Connect through meaningful content</li>
        </ul>

        <h2>Technology with Purpose</h2>
        <p>
          Zenticle is built using modern, efficient technologies: React, Redux, Node.js, Express, and MongoDB.
          It’s designed to be fast, clean, and inspiring — because your words deserve a beautiful platform.
        </p>

        <h2>Stay Connected</h2>
        <p>
          Have feedback, thoughts, or ideas? We'd love to hear from you.
          <br />
          Reach out anytime through email or our social channels.
        </p>

        <p className="thanks">Thanks for visiting Zenticle — Happy Writing!</p>
      </div>
    </div>
  );
}
