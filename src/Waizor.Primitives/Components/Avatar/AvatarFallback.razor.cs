using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components;

public partial class AvatarFallback : ComponentBase
{
    [CascadingParameter]
    public required Avatar Avatar { get; set; }

    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public string? Class { get; set; }
}
