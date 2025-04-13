namespace Waizor.Exceptions;

public class ElementReferenceNotProvidedException(string componentName)
    : Exception(
        $"Element reference was not provided to \"{componentName}\". Please make sure you pass it via. the \"For\" parameter, if you are also using the \"AsChild\" parameter."
    )
{ }
