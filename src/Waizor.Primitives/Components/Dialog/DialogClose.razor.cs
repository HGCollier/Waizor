using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Waizor.Primitives.Abstractions;

namespace Waizor.Primitives.Components;

public partial class DialogClose : SlotBase
{
    [Parameter]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Parameter]
    public string? Class { get; set; }

    [Parameter]
    public EventCallback<MouseEventArgs> OnClick { get; set; }

    [CascadingParameter]
    public required IDialog Dialog { get; set; }

    protected override Dictionary<string, object> Attributes
    {
        get
        {
            Dictionary<string, object> attributes =
                new() { { "id", Id }, { "onclick", (MouseEventArgs args) => OnClickAsync(args) } };

            if (Class != null)
            {
                attributes.Add("class", Class);
            }

            return attributes;
        }
    }

    private async Task OnClickAsync(MouseEventArgs args)
    {
        Dialog.Hide();
        await OnClick.InvokeAsync(args);
    }
}
