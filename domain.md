# Understanding The Domain

- A quiz is a game where players attempt to answer questions
- Questions are set by a quizmaster
- In this context, all questions are either multiple choice (one answer) or multiple response (multiple answers)
- A series of questions is asked as part of a round (the SAA-C02 exam is 65 questions)
- In this quiz, questions are open (can be answered) for a limited period of time. Then the question is closed.
- A person who answers questions is a player.
- When a question is closed, it can be marked. In this quiz, players are given one point for one correct answer.

# Worked Example

- Our _quiz_ is the overall application (bezOS), and AWS exams are run as _rounds_.
- The _quizmaster_ is the application administrator (e.g. me).
- There are 10 [AWS SAA-C02 sample questions](https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Sample-Questions.pdf), which makes a _round_ of 10 questions.
- We _pose_ one question every working day (M-F), so this _round_ lasts 10 work days / 2 work weeks.
- Questions are _open_ for 24 hours, then they are _closed_.
- _Players_ can submit _answers_ to the question when it is _open_. Answers can be edited while the question is _open_.
- Once a question is _closed_, the application will _mark_ all _players_. In this application, players will receive their results invdividually.

# Why pose?

- Set overlaps with a mathematical/computer science term
- Our app doesn't ask people directly: https://english.stackexchange.com/questions/153013/did-they-ask-or-pose-a-question
