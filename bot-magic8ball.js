(function () {
  let bot = {
    // Start with no messages
    messages: [],
    emojis: [],
    hide: false,
    name: "magic8ball",
    description:
      "A Magic 8 Ball bot that provides random answers to user questions.",
    chatControlsHeight: 100,
    wishCount: 0, // Initialize the wish count

    grammar: new tracery.Grammar({
      answer: [
        "Yes",
        "No",
        "Maybe",
        "Ask again later",
        "Outlook not so good",
        "Certainly",
        "Without a doubt",
        "Don't count on it",
        "It is certain",
        "Very doubtful",
        "Most likely",
        "Outlook good",
        "Cannot predict now",
      ],
    }),

    getRandomAnswer() {
      return this.grammar.flatten("#answer#");
    },

    setup() {
      console.log("Setup", this.name);
      this.messages.push({
        text: "I am the Magic 8 Ball. Ask me a question!",
        from: "bot",
      });
    },

    // Modify the input method to include audio playback and count wishes
    input({ text, from, otherDataHere }) {
      console.log(`The bot received some input from the user: '${text}'`);
      this.emojis.push("🎱");
      this.messages.push({
        text,
        from,
      });

      this.wishCount++; // Increment the wish count

      let timeForBotToRespond = 1000;
      let answer = ""; // Initialize the answer variable

      // Check for different keywords or patterns in the user input
      if (text.toLowerCase().includes("love")) {
        answer = "Love is in the air! Definitely.";
      } else if (text.toLowerCase().includes("work")) {
        answer = "Focus on your goals, and success will follow.";
      } else if (text.toLowerCase().includes("health")) {
        answer = "Health is wealth. Take care of yourself.";
      } else {
        answer = this.getRandomAnswer(); // Use the Magic 8 Ball's random answer
      }

      // Simulate the bot responding after some time
      setTimeout(() => {
        this.messages.push({
          text: answer,
          from: "bot",
        });

        this.playSound(); // Call the method to play the audio
      }, timeForBotToRespond);
    },

    // Add a new audio component for the bot
    playSound() {
      let audio = new Audio(
        "https://cdn.glitch.global/a0e5da03-5680-4f54-b15f-709870a84943/sound-effect-twinklesparkle-pixabay.mp3?v=1699233676405"
      );
      audio.play();
    },

    changeBackgroundColor() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "lightblue"; // Change the background color here
      ctx.fillRect(0, 0, 200, 200);
    },
  };

  //============================================================
  /**
   * TODO: A panel to the right of the chat
   * Could be for p5, drawing, displaying images, a game board, etc,
   * or leave it blank
   **/

  Vue.component(`panel-${bot.name}`, {
		template: `<div>

			Wish count: {{bot.wishCount}}
      <span v-for="emoji in bot.emojis" :key="emoji">{{ emoji }}</span>

		</div>`,
    props: { bot: { required: true, type: Object } }, // We need to have bot
  });

  //============================================================
  /**
   * Input controls for this bot.
   * Do we just need a chat input? Do we need anything else?
   * What about game controls, useful buttons, sliders?
   **/

  Vue.component(`input-${bot.name}`, {
    // Custom inputs for this bot
    template: `<div>
			<!-- Basic chat control, press enter or the button to input -->
			<input @keyup.enter="sendText" v-model="inputText" />
			<button @click="sendText">send</button>

		</div>`,

    methods: {
      sendText() {
        // Send the current text to the bot
        this.bot.input({ text: this.inputText, from: "user" });
        // Then clear it
        this.inputText = "";
      },
    },

    // Custom data for these controls
    data() {
      return {
        inputText: "",
      };
    },
    props: { bot: { required: true, type: Object } }, // We need to have bot
  });

  bots.push(bot);
})();
