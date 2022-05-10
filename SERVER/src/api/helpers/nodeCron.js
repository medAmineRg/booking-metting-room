const { CronJob } = require("cron");
const lookingForNonCacledToCancel = () => {
  const job = new CronJob(
    "*/10 * * * * *",
    function () {
      console.log("You will see this message every second");
    },
    null,
    null,
    "Africa/Casablanca"
  );
  job.start();
};

module.exports = {
  lookingForNonCacledToCancel,
};
