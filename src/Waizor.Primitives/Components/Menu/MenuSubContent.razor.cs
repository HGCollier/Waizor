using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components.Internal;

public partial class MenuSubContent : MenuContentImplementation
{
    [CascadingParameter]
    public required MenuSub MenuSub { get; set; }
}
