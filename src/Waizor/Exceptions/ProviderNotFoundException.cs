namespace Waizor.Exceptions;

public class ProviderNotFoundException(string providerName)
    : Exception(
        $"Provider ({providerName}) was not found, did you forget to add it in App.razor?"
    ) { }
