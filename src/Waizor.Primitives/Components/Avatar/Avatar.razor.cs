using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components;

public partial class Avatar : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public string? Class { get; set; }

    public AvatarStatus Status { get; set; }

    public void UpdateStatus(AvatarStatus status)
    {
        Status = status;

        StateHasChanged();
    }
}
