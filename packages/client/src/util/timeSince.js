// Function to calculate the relative time elapsed since a given timestamp
export const timeSince = (timestamp) => {
  // Calculate the difference in seconds between the current time and the given timestamp
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);

  // Check if the time difference is greater than or equal to one year (in seconds)
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years"; // Return the number of years
  }

  // Check if the time difference is greater than or equal to one month (in seconds)
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months"; // Return the number of months
  }

  // Check if the time difference is greater than or equal to one day (in seconds)
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days"; // Return the number of days
  }

  // Check if the time difference is greater than or equal to one hour (in seconds)
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours"; // Return the number of hours
  }

  // Check if the time difference is greater than or equal to one minute (in seconds)
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes"; // Return the number of minutes
  }

  // If the time difference is less than a minute, return the number of seconds
  return Math.floor(seconds) + " seconds";
};
