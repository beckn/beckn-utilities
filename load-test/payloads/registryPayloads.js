export const registryLookupForSpecificBPP = (bpp_id, domain) => {
  return {
    type: "BPP",
    domain: domain,
    subscriber_id: bpp_id
  };
};

export const registryLookupForBG = (domain) => {
  return {
    type: "BG",
    domain: domain
  };
};
