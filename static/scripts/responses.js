function getBotResponse(input) {
    // Check for specific social media platforms
    if (input.match(/facebook/i)) {
        return "If you're having trouble accessing your Facebook account, you can try resetting your password or reporting a login issue. Here's a link to the Facebook Help Center: https://www.facebook.com/help/";
    } else if (input.match(/instagram/i)) {
        return "Are you having trouble with your Instagram account? Check out the Instagram Help Center for tips and support: https://help.instagram.com/";
    } else if (input.match(/twitter/i)) {
        return "If you need help with your Twitter account, visit the Twitter Help Center for troubleshooting and support: https://help.twitter.com/";

    // Check for specific games or platforms
    } else if (input.match(/fortnite/i)) {
        return "Do you need help with Fortnite? Here are some tips and resources: https://www.epicgames.com/fortnite/en-US/help-center/";
    } else if (input.match(/steam/i)) {
        return "If you're having trouble with Steam, you can try checking the Steam Help Center for answers to common issues: https://help.steampowered.com/en/";

    // Simple responses
    } else if (input == "hello") {
        return "Hello there!";
    } else if (input == "hi") {
        return "Hello there!";
    } else if (input == "are you there?") {
        return "Hello there!";
    } else if (input == "my name is") {
        return "Hello there!";
            
    } else if (input == "goodbye") {
        return "Talk to you later!";
    } else {
        return "I'm sorry, I'm not sure what you're asking. Try asking something else!";
    }
    //api
    async function query(data) {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/gpt2",
            {
                headers: { Authorization: "Bearer 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" },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        const result = await response.json();
        return result;
    }
    
    query({"inputs": "Can you please let us know more details about your "}).then((response) => {
        console.log(JSON.stringify(response));
    });
}
