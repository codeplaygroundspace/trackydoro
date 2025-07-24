const About = () => {
  return (
    <div className="mt-16 max-w-xl mx-auto">
      <h1 className="text-4xl font-semibold text-foreground mb-4 md:mb-12">
        Boost your productivity 🚀
      </h1>
      <h2 className="text-xl font-semibold text-foreground mb-4">What is Trackydoro?</h2>
      <p className="text-muted-foreground leading-relaxed mb-8">
        Trackydoro is a customizable pomodoro timer that works on desktop & mobile browser. The aim
        of this app is to help you focus on any project you are working on, such as study, writing,
        or coding. This app is inspired by{' '}
        <a
          href="https://www.pomodorotechnique.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-semibold hover:underline"
        >
          Pomodoro Technique
        </a>{' '}
        which is a time management method developed by Francesco Cirillo .
      </p>

      <h2 className="text-xl font-semibold text-foreground mb-4">What is Pomodoro Technique?</h2>
      <p className="text-muted-foreground leading-relaxed mb-8">
        The Pomodoro Technique is created by Francesco Cirillo for a more productive way to work and
        study. The technique uses a timer to break down work into intervals, traditionally 25
        minutes in length, separated by short breaks. Each interval is known as a pomodoro, from the
        Italian word for &apos;tomato&apos;, after the tomato-shaped kitchen timer that Cirillo used
        as a university student. -{' '}
        <a
          href="https://en.wikipedia.org/wiki/Pomodoro_Technique"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-semibold hover:underline"
        >
          {' '}
          Wikipedia.
        </a>
      </p>

      <h2 className="text-xl font-semibold text-foreground mb-4">How to use the Pomodoro Timer?</h2>
      <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-8">
        <li>Add projects to work on today</li>
        <li>Set estimate pomodoros (1 = 25min of work) for each projects</li>
        <li>Select a project to work on</li>
        <li>Start timer and focus on the project for 25 minutes</li>
        <li>Take a break for 5 minutes when the alarm ring</li>
        <li>Iterate 3-5 until you finish the projects</li>
      </ol>
    </div>
  );
};

export default About;
