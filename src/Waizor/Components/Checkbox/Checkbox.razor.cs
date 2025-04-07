using Microsoft.AspNetCore.Components;

namespace Waizor.Components;

public partial class Checkbox<T> : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Parameter]
    public string? Name { get; set; }

    [Parameter]
    public string? Class { get; set; }

    [Parameter]
    public bool Checked { get; set; }

    [Parameter]
    public EventCallback<bool> CheckedChanged { get; set; }

    [Parameter]
    public T? Value { get; set; }

    [Parameter]
    public bool Disabled { get; set; }

    [Parameter]
    public bool ReadOnly { get; set; }

    [Parameter]
    public bool Required { get; set; }

    private async Task OnClickAsync()
    {
        if (ReadOnly)
        {
            return;
        }

        Checked = !Checked;

        await CheckedChanged.InvokeAsync(Checked);
    }
}
