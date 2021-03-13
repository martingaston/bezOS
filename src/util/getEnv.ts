export const getEnv = (requestedEnv: string): string => {
  const foundEnv = process.env[requestedEnv];

  if (typeof foundEnv == "string") {
    return foundEnv;
  } else {
    throw new Error(
      `You've asked for environment variable ${requestedEnv} but this is not currently set.`
    );
  }
};
