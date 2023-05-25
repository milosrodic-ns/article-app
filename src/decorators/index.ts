import { AppRouter } from "../utilities/AppRouter";

enum Methods {
  get = "get",
  post = "post",
  put = "put",
  patch = "patch",
  delete = "delete",
}

enum MetadataKeys {
  method = "method",
  path = "path",
}

function binder(method: Methods) {
  return function (path: string = "") {
    return function (target: any, key: string, desc: PropertyDescriptor) {
      Reflect.defineMetadata(MetadataKeys.method, method, desc.value, key);
      Reflect.defineMetadata(MetadataKeys.path, path, desc.value, key);
    };
  };
}

export function Controller(prefix: string = "") {
  return function (target: any) {
    const router = AppRouter.getInstance();
    const targetClass = new target();

    Object.getOwnPropertyNames(target.prototype).forEach((key) => {
      if (key === "constructor") {
        return;
      }

      const method: Methods = Reflect.getMetadata(
        MetadataKeys.method,
        targetClass[key],
        key
      );
      const path: string = Reflect.getMetadata(
        MetadataKeys.path,
        targetClass[key],
        key
      );

      if (method) {
        router[method](`${prefix}${path}`, targetClass[key]);
      }
    });
  };
}

export const Get = binder(Methods.get);
export const Post = binder(Methods.post);
export const Put = binder(Methods.put);
export const Patch = binder(Methods.patch);
export const Delete = binder(Methods.delete);
