using Microsoft.AspNetCore.Components;
using Waizor.Abstractions;

namespace Waizor.Components;

public partial class PopoverClose : SlotBase
{
    [Parameter]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Parameter]
    public string? Class { get; set; }

    [CascadingParameter]
    public required Popover Popover { get; set; }

    protected override Dictionary<string, object> Attributes
    {
        get
        {
            Dictionary<string, object> attributes =
                new() { { "id", Id }, { "onclick", async () => await OnClickAsync() } };

            if (Class != null)
            {
                attributes.Add("class", Class);
            }

            return attributes;
        }
    }

    private async Task OnClickAsync() => await Popover.HideAsync();
}
