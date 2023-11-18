(function () {
  let bot = {
    // Start with no messages
    messages: [],
    hide: false,
    name: "badadvice",
    description: "A bot that gives intentionally bad advice.",
    chatControlsHeight: 100,
    mood: "neutral", // Set the initial mood to neutral

    // Define the Tracery grammar for bad advice based on mood
    grammar: {
      neutral: tracery.createGrammar({
        advice: [
          "Why not try jumping off a cliff?",
          "Eat a whole cake, it's good for your health!",
          "Don't worry about your deadlines, procrastinate more!",
        ],
      }),
      angry: tracery.createGrammar({
        advice: [
          "Throw your computer out the window.",
          "Yell at your boss in the middle of a meeting.",
          "Tell your friends what you really think of them.",
        ],
      }),
      happy: tracery.createGrammar({
        advice: [
          "Treat yourself to a shopping spree!",
          "Go on a spontaneous vacation.",
          "Buy a pet sloth, they make great companions!",
        ],
      }),
    },

    getRandomAdvice() {
      return this.grammar[this.mood].flatten("#advice#");
    },

    setup() {
      console.log("Setup", this.name);
      this.messages.push({
        text: "Hello there! Need some bad advice? Ask away!",
        from: "bot",
      });
    },

    input({ text, from, otherDataHere }) {
      console.log(`The bot received some input from the user: '${text}'`);
      this.messages.push({
        text,
        from,
      });

      let timeForBotToRespond = 1000;
      // Change the bot's mood based on specific input
      if (
        text.toLowerCase().includes("angry") ||
        text.toLowerCase().includes("hate") ||
        text.toLowerCase().includes("sad")
      ) {
        this.changeMood("angry");
      } else if (
        text.toLowerCase().includes("happy") ||
        text.toLowerCase().includes("love") ||
        text.toLowerCase().includes("want")
      ) {
        this.changeMood("happy");
      } else {
        this.changeMood("neutral");
      }
      // Think a bit longer, then post a bad advice
      let timeForBotToThink = timeForBotToRespond + 1000;
      setTimeout(() => {
        this.messages.push({
          text: this.getRandomAdvice(),
          from: "bot",
        });
      }, timeForBotToThink);
    },

    changeMood(newMood) {
      this.mood = newMood;
      console.log(`The bot is now in a ${this.mood} mood.`);
    },
  };

  // Include components and other necessary functionalities here

  // P5 canvas to represent the bot's mood or state
  // P5 canvas to represent the bot's mood or state
  Vue.component(`panel-${bot.name}`, {
    template: `
    <div>
      <canvas ref="canvas" width="200" height="200"></canvas>
    </div>
  `,
    props: { bot: { required: true, type: Object } },
    mounted() {
      this.drawState();
    },
    watch: {
      "bot.mood": "drawState",
    },
    methods: {
      drawState() {
        const canvas = this.$refs.canvas;
        const ctx = canvas.getContext("2d");
        const { mood } = this.bot;
        if (mood === "neutral") {
          ctx.fillStyle = "yellow";
        } else if (mood === "angry") {
          ctx.fillStyle = "red";
        } else if (mood === "happy") {
          ctx.fillStyle = "green";
        }
        ctx.fillRect(0, 0, 200, 200);
      },
    },
  });

  // Input controls for the bot
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
