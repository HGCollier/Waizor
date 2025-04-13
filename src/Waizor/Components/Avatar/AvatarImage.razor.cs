using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Waizor.Components;

public partial class AvatarImage(IJSRuntime jsRuntime) : ComponentBase, IDisposable
{
    [CascadingParameter]
    public required Avatar Avatar { get; set; }

    [Parameter, EditorRequired]
    public required string Src { get; set; }

    [Parameter, EditorRequired]
    public required string Alt { get; set; }

    [Parameter]
    public int? Width { get; set; }

    [Parameter]
    public int? Height { get; set; }

    [Parameter]
    public string? Class { get; set; }

    private DotNetObjectReference<AvatarImage>? _dotNetObjectReference;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender || jsRuntime == null)
        {
            return;
        }

        _dotNetObjectReference = DotNetObjectReference.Create(this);
        await jsRuntime.InvokeVoidAsync("avatar", Src, _dotNetObjectReference);
    }

    [JSInvokable]
    public void UpdateStatus(AvatarStatus status) => Avatar.UpdateStatus(status);

    public void Dispose() => _dotNetObjectReference?.Dispose();
}
